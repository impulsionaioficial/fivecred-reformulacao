'use client';
import styles from './Footer.module.css';

export default function Footer() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <img src="/logo.png" alt="FiveCred" style={{ height: 38, width: 'auto' }} />
            <p>Crédito com transparência, sem burocracia e sem surpresas. Para aposentados, pensionistas, CLT e muito mais.</p>
          </div>
          <div className={styles.cols}>
            <div>
              <h4>Crédito</h4>
              <ul>
                {['Consignado INSS','Consignado CLT','Antecipação FGTS','Conta de Luz','Empréstimo Pessoal'].map(l => <li key={l}>{l}</li>)}
              </ul>
            </div>
            <div>
              <h4>Empresa</h4>
              <ul>
                {[['Como Funciona','como-funciona'],['Depoimentos','depoimentos'],['Segurança','seguranca'],['Simular','simulacao']].map(([l, id]) => (
                  <li key={l} onClick={() => go(id)} style={{ cursor: 'pointer' }}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} FiveCred. Todos os direitos reservados.</p>
          <p className={styles.legal}>Nenhuma taxa antecipada. Simulação 100% gratuita e sem compromisso.</p>
        </div>
      </div>
    </footer>
  );
}
