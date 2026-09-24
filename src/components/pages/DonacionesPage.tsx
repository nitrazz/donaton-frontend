import React, { useState, useEffect } from 'react';
import { donacionesApi } from '../../services/api';
import { useToast }       from '../../hooks/useToast';
import type { Donacion, NuevaDonacion, ApiError } from '../../types';

// ── Tipos locales ─────────────────────────────────────────────────────────────
type TipoDonacion = 'INDIVIDUAL' | 'EMPRESARIAL';

const estadoColor: Record<string, { bg: string; color: string; label: string }> = {
  PENDIENTE:  { bg: '#FAEEDA', color: '#BA7517', label: 'Pendiente'  },
  COMPLETADA: { bg: '#E1F5EE', color: '#0F6E56', label: 'Completada' },
  FALLBACK:   { bg: '#FCEBEB', color: '#A32D2D', label: 'No disponible' },
};

// ── Componente ────────────────────────────────────────────────────────────────
export const DonacionesPage: React.FC = () => {
  const [donaciones, setDonaciones]   = useState<Donacion[]>([]);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const { showError, showSuccess }    = useToast();

  // Formulario
  const [form, setForm] = useState<Partial<NuevaDonacion>>({ tipo: 'INDIVIDUAL' });

  // ── Carga inicial ───────────────────────────────────────────────────────────
  useEffect(() => {
    donacionesApi.listarDonaciones()
      .then((data) => setDonaciones(data as Donacion[]))
      .catch((err: ApiError) => showError(err))
      .finally(() => setLoading(false));
  }, []);

  // ── Crear donación ──────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.tipo || !form.monto || !form.nombre || !form.objeto) return;
    setSaving(true);
    try {
      const nueva = await donacionesApi.crearDonacion(form as NuevaDonacion);
      setDonaciones((prev) => [...prev, nueva as Donacion]);
      showSuccess('Donación registrada correctamente.');
      setModalOpen(false);
      setForm({ tipo: 'INDIVIDUAL' });
    } catch (err) {
      showError(err as ApiError);
    } finally {
      setSaving(false);
    }
  }

  // ── Completar donación ──────────────────────────────────────────────────────
  async function completar(id: number) {
    try {
      await donacionesApi.completarDonacion(id);
      setDonaciones((prev) =>
        prev.map((d) => d.id === id ? { ...d, estado: 'COMPLETADA' as const } : d)
      );
      showSuccess('Donación marcada como completada.');
    } catch (err) {
      showError(err as ApiError);
    }
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '8px 10px', borderRadius: '8px',
    border: '0.5px solid rgba(0,0,0,0.2)', fontSize: '13.5px',
    fontFamily: 'inherit', outline: 'none',
  };

  return (
    <div>
      {/* Topbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Gestión de Donaciones</h1>
          <p style={{ fontSize: '13px', color: '#888780', marginTop: '2px' }}>
            Registro de donaciones individuales y empresariales
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            padding: '8px 14px', borderRadius: '8px', border: 'none',
            background: '#D85A30', color: '#fff', fontWeight: 500,
            fontSize: '13.5px', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          ＋ Nueva Donación
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '1.75rem' }}>
        {[
          { label: 'Total Donaciones', value: donaciones.length },
          { label: 'Pendientes',       value: donaciones.filter(d => d.estado === 'PENDIENTE').length },
          { label: 'Completadas',      value: donaciones.filter(d => d.estado === 'COMPLETADA').length },
        ].map((s, i) => (
          <div key={i} style={{ background: '#F5F4F0', borderRadius: '8px', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <p style={{ fontSize: '12px', color: '#888780', marginBottom: '6px' }}>{s.label}</p>
            <p style={{ fontSize: '24px', fontWeight: 700 }}>{s.value}</p>
            <div style={{ position: 'absolute', right: '-12px', bottom: '-12px', width: '56px', height: '56px', borderRadius: '50%', background: '#D85A30', opacity: 0.12 }} />
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700 }}>Todas las donaciones</h2>
        </div>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888780' }}>Cargando donaciones…</div>
        ) : donaciones.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888780' }}>No hay donaciones registradas aún.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  {['#', 'Donante', 'Objeto', 'Monto', 'Tipo', 'Estado', 'Acción'].map(h => (
                    <th key={h} style={{ padding: '10px 1.25rem', textAlign: 'left', fontSize: '11px', fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', color: '#888780', borderBottom: '0.5px solid rgba(0,0,0,0.1)', background: '#F1EFE8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donaciones.map((d) => {
                  const badge = estadoColor[d.estado] ?? estadoColor.PENDIENTE;
                  return (
                    <tr key={d.id} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                      <td style={{ padding: '12px 1.25rem', fontFamily: 'monospace', fontSize: '11px', color: '#B4B2A9' }}>#{d.id}</td>
                      <td style={{ padding: '12px 1.25rem', fontWeight: 500 }}>{d.donanteNombre}</td>
                      <td style={{ padding: '12px 1.25rem', color: '#5F5E5A' }}>{d.nombreObjeto}</td>
                      <td style={{ padding: '12px 1.25rem' }}>${d.monto?.toLocaleString('es-CL')}</td>
                      <td style={{ padding: '12px 1.25rem' }}>
                        <span style={{ fontSize: '12px', color: d.tipo === 'EMPRESARIAL' ? '#185FA5' : '#5F5E5A' }}>
                          {d.tipo === 'EMPRESARIAL' ? '🏢 Empresarial' : '👤 Individual'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 1.25rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 500, background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 1.25rem' }}>
                        {d.estado === 'PENDIENTE' && (
                          <button
                            onClick={() => completar(d.id)}
                            style={{ padding: '5px 10px', borderRadius: '6px', border: '0.5px solid rgba(0,0,0,0.15)', background: 'transparent', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            ✓ Completar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.15)', width: '480px', maxWidth: '92vw', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 700 }}>Nueva Donación</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Tipo */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#5F5E5A', marginBottom: '5px' }}>Tipo de donación *</label>
                <select style={input} value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as TipoDonacion }))}>
                  <option value="INDIVIDUAL">👤 Individual</option>
                  <option value="EMPRESARIAL">🏢 Empresarial</option>
                </select>
              </div>

              {/* Nombre y Objeto */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#5F5E5A', marginBottom: '5px' }}>Nombre del donante *</label>
                  <input style={input} placeholder="Ej: Juan Pérez" value={form.nombre ?? ''} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#5F5E5A', marginBottom: '5px' }}>Objeto donado *</label>
                  <input style={input} placeholder="Ej: Ropa de abrigo" value={form.objeto ?? ''} onChange={e => setForm(f => ({ ...f, objeto: e.target.value }))} />
                </div>
              </div>

              {/* Monto */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#5F5E5A', marginBottom: '5px' }}>Monto (CLP) *</label>
                <input style={input} type="number" min={1} placeholder="Ej: 50000" value={form.monto ?? ''} onChange={e => setForm(f => ({ ...f, monto: parseFloat(e.target.value) || undefined }))} />
              </div>

              {/* Campos empresariales */}
              {form.tipo === 'EMPRESARIAL' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#5F5E5A', marginBottom: '5px' }}>RUT empresa</label>
                    <input style={input} placeholder="Ej: 76.123.456-7" value={form.rut ?? ''} onChange={e => setForm(f => ({ ...f, rut: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#5F5E5A', marginBottom: '5px' }}>Certificado impuestos</label>
                    <input style={input} placeholder="Nº certificado" value={form.certificado ?? ''} onChange={e => setForm(f => ({ ...f, certificado: e.target.value }))} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '1rem', borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ ...input, width: 'auto', padding: '8px 14px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={saving} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: saving ? '#F0997B' : '#D85A30', color: '#fff', fontWeight: 500, fontSize: '13.5px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {saving ? 'Registrando…' : '✓ Registrar Donación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonacionesPage;