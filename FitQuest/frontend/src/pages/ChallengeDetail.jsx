import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getChallenge, joinChallenge, leaveChallenge, getChallenges } from '../api/challenges';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';
import useAuth from '../hooks/useAuth';
import styles from './ChallengeDetail.module.css';

const difficultyConfig = {
  facil: { label: 'Fácil', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  intermedio: { label: 'Intermedio', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  dificil: { label: 'Difícil', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

const tips = {
  '30 días de Running': ['Usa zapatillas adecuadas para evitar lesiones', 'Aumenta la intensidad gradualmente', 'Hidrátate antes y después de correr', 'Escoge superficies blandas para correr'],
  '10.000 Pasos Diarios': ['Usa un podómetro o app para contar pasos', 'Divide los pasos en varias caminatas', 'Camina mientras hablas por teléfono', 'Bájate una parada antes del transporte'],
  'Reto de Flexiones': ['Mantén el cuerpo recto durante el ejercicio', 'Respira de forma controlada', 'Descansa 30 seg entre series', 'Empieza con flexiones de rodillas si es necesario'],
  'Yoga Diario': ['Practica en un lugar tranquilo y sin distracciones', 'Usa una esterilla antideslizante', 'Concéntrate en tu respiración', 'No forces las posturas, escucha tu cuerpo'],
  'Abdominales 30 Días': ['Realiza los ejercicios con control, no con impulso', 'Combina diferentes tipos de abdominales', 'Mantén el cuello relajado', 'Hazlos al menos 1 hora después de comer'],
  'Reto de Lectura Diaria': ['Elige un libro que realmente te motive', 'Crea un rincón de lectura cómodo', 'Apaga las notificaciones del móvil', 'Lleva un libro siempre en tu mochila'],
  'Escaleras Diarias': ['Empieza despacio los primeros días', 'Usa calzado cómodo y seguro', 'Sube de forma constante sin detenerte', 'Aumenta el número de pisos gradualmente'],
  'Reto de Estiramientos': ['Nunca estires en frío, calienta primero', 'Mantén cada estiramiento 20-30 segundos', 'Respira profundamente mientras estiras', 'No rebotes, mantén la posición estática'],
  'Plancha 30 Días': ['Mantén el abdomen contraído todo el tiempo', 'La espalda debe estar completamente recta', 'Mira al suelo para alinear el cuello', 'Aprieta los glúteos para mayor estabilidad'],
  'Reto de Natación': ['Calienta fuera del agua antes de entrar', 'Controla tu respiración al nadar', 'Usa gafas para proteger tus ojos', 'Alterna estilos para trabajar distintos músculos'],
  'Sin Redes Sociales': ['Desactiva las notificaciones de todas las apps', 'Borra las apps del móvil durante el reto', 'Ten un plan alternativo para tu tiempo libre', 'Avísale a tus amigos para que lo entiendan'],
};

const defaultTips = ['Escucha a tu cuerpo y respeta sus límites', 'La constancia es más importante que la intensidad', 'Registra tu progreso cada día', 'Comparte tu experiencia con otros participantes'];
const benefits = {
  facil: ['Ideal para principiantes', 'Bajo riesgo de lesiones', 'Fácil de incorporar a la rutina', 'Resultados visibles rápidamente'],
  intermedio: ['Requiere algo de experiencia', 'Desafío equilibrado', 'Mejora notable en condición física', 'Construye disciplina'],
  dificil: ['Alto nivel de exigencia', 'Resultados máximos', 'Superación personal garantizada', 'Requiere compromiso total'],
};

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [actioning, setActioning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [allChallenges, setAllChallenges] = useState([]);

  useEffect(() => {
    Promise.all([getChallenge(id), getChallenges()])
      .then(([challengeRes, allRes]) => {
        setChallenge(challengeRes.data.data);
        setAllChallenges(allRes.data.data.filter(c => c.id !== parseInt(id)));
      })
      .catch((err) => setError(err.response?.data?.message || 'Error al cargar reto'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoin = async () => {
    setActioning(true); setError(''); setActionMsg('');
    try { const res = await joinChallenge(id); setActionMsg(res.data.message || '¡Te has inscrito al reto!'); }
    catch (err) { setError(err.response?.data?.message || 'Error al unirse'); }
    finally { setActioning(false); }
  };

  const handleLeave = async () => {
    setActioning(true); setError(''); setActionMsg('');
    try { const res = await leaveChallenge(id); setActionMsg(res.data.message || 'Has abandonado el reto'); }
    catch (err) { setError(err.response?.data?.message || 'Error al abandonar'); }
    finally { setActioning(false); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { alert(`Copia este enlace: ${url}`); }
  };

  if (loading) return <MainLayout><LoadingSpinner /></MainLayout>;
  if (!challenge) return <MainLayout><p>Reto no encontrado</p></MainLayout>;

  const diff = difficultyConfig[challenge.difficulty] || difficultyConfig.facil;
  const imgUrl = challenge.image || 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&h=500&fit=crop';
  const challengeTips = tips[challenge.title] || defaultTips;
  const diffBenefits = benefits[challenge.difficulty] || benefits.facil;
  const related = allChallenges.filter(c => c.difficulty === challenge.difficulty).slice(0, 2);
  const weeks = Math.ceil(challenge.duration_days / 7);

  return (
    <MainLayout>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Volver
      </button>

      <div className={styles.banner}>
        <img className={styles.bannerImg} src={imgUrl} alt={challenge.title}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }} />
        <div className={styles.bannerFallback}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>{challenge.title}</h1>
          <div className={styles.bannerBadges}>
            <span className={styles.bannerBadge} style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.color}40` }}>
              {diff.label}
            </span>
            <span className={styles.bannerBadge} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {challenge.duration_days} días • {weeks} {weeks === 1 ? 'semana' : 'semanas'}
            </span>
            <span className={styles.bannerBadge} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {challenge.difficulty === 'facil' ? 'Principiante' : challenge.difficulty === 'intermedio' ? 'Intermedio' : 'Avanzado'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>📋 Descripción del Reto</h2>
            <p className={styles.descText}>{challenge.description}</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Duración</p>
              <p className={styles.statValue}>{challenge.duration_days} <span className={styles.statUnit}>días</span></p>
              <p className={styles.statSub}>Aprox. {weeks} {weeks === 1 ? 'semana' : 'semanas'}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Dificultad</p>
              <p className={styles.statValue} style={{ color: diff.color }}>{diff.label}</p>
              <p className={styles.statSub}>
                {challenge.difficulty === 'facil' ? 'Para todos los niveles' : challenge.difficulty === 'intermedio' ? 'Requiere constancia' : 'Alto compromiso'}
              </p>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>✅ Beneficios</h2>
            <div className={styles.benefitsGrid}>
              {diffBenefits.map((b, i) => (
                <div key={i} className={styles.benefitItem}>
                  <span className={styles.benefitIcon} style={{ background: `${diff.color}15`, color: diff.color }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span className={styles.benefitText}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>💡 Consejos para superar el reto</h2>
            <div className={styles.tipsList}>
              {challengeTips.map((tip, i) => (
                <div key={i} className={styles.tipItem}>
                  <span className={styles.tipNumber}>{i + 1}</span>
                  <span className={styles.tipText}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', padding: '0.65rem 0.9rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
          {actionMsg && <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: '#10b981', padding: '0.65rem 0.9rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.85rem' }}>{actionMsg}</div>}

          <div className={styles.sidebarCard}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button onClick={handleJoin} disabled={actioning} className={styles.joinBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  {actioning ? 'Procesando...' : 'Unirse al Reto'}
                </button>
                <button onClick={handleLeave} disabled={actioning} className={styles.leaveBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Abandonar Reto
                </button>
                <button onClick={() => navigate(`/challenges/${id}/ranking`)} className={styles.rankingBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  Ver Ranking
                </button>
              </div>
            ) : (
              <div className={styles.loginPrompt}>
                <p className={styles.loginPromptText}>Inicia sesión para unirte a este reto</p>
                <Link to="/login" className={styles.loginLink}>Iniciar Sesión</Link>
              </div>
            )}

            <div className={styles.shareSection}>
              <p className={styles.shareLabel}>Compartir</p>
              <button onClick={handleShare} className={styles.shareBtn} style={{
                background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.06)',
                color: copied ? '#10b981' : '#6366f1',
                border: `1px solid ${copied ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.15)'}`,
              }}>
                {copied ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Enlace copiado</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Copiar enlace</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>🔗 Retos similares</h2>
          <div className={styles.relatedGrid}>
            {related.map((r) => {
              const rDiff = difficultyConfig[r.difficulty] || difficultyConfig.facil;
              return (
                <Link key={r.id} to={`/challenges/${r.id}`} className={styles.relatedCard}>
                  <div className={styles.relatedThumb}>
                    <img src={r.image || imgUrl} alt={r.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }} />
                    <div className={styles.relatedFallback}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  </div>
                  <div className={styles.relatedInfo}>
                    <p className={styles.relatedName}>{r.title}</p>
                    <div className={styles.relatedMeta}>
                      <span className={styles.relatedBadge} style={{ background: rDiff.bg, color: rDiff.color }}>{rDiff.label}</span>
                      <span className={styles.relatedDays}>{r.duration_days} días</span>
                    </div>
                  </div>
                  <svg className={styles.relatedArrow} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ChallengeDetail;
