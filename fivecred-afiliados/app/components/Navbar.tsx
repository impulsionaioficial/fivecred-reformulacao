"use client";

import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fivecred-header-white-react">
      <style dangerouslySetInnerHTML={{ __html: `
        .fivecred-header-white-react {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          background-color: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          z-index: 10000 !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
          font-family: 'Space Grotesk', 'Outfit', sans-serif !important;
          height: 80px !important;
          box-sizing: border-box !important;
          display: block !important;
        }
        .fivecred-header-white-react * {
          box-sizing: border-box !important;
          margin: 0;
          padding: 0;
        }
        .fivecred-header-white-react .nav-container {
          max-width: 1200px !important;
          margin: 0 auto !important;
          padding: 0 2rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          height: 100% !important;
        }
        .fivecred-header-white-react .logo {
          display: flex !important;
          align-items: center !important;
        }
        .fivecred-header-white-react .logo-icon {
          height: 38px !important;
          width: auto !important;
        }
        .fivecred-header-white-react .nav-links {
          display: flex !important;
          gap: 2.5rem !important;
          align-items: center !important;
        }
        .fivecred-header-white-react .nav-links a {
          color: #0f172a !important;
          font-weight: 500 !important;
          font-size: 0.95rem !important;
          text-decoration: none !important;
          transition: color 0.2s ease !important;
          position: relative !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.25rem !important;
        }
        .fivecred-header-white-react .nav-links a.nav-item::after {
          content: '' !important;
          position: absolute !important;
          bottom: -4px !important;
          left: 0 !important;
          width: 0% !important;
          height: 2px !important;
          background-color: #ff6b00 !important;
          transition: all 0.3s ease !important;
        }
        .fivecred-header-white-react .nav-links a.nav-item:hover::after {
          width: 100% !important;
        }
        .fivecred-header-white-react .nav-links a:hover {
          color: #ff6b00 !important;
        }
        .fivecred-header-white-react .dropdown {
          position: relative !important;
          display: inline-block !important;
        }
        .fivecred-header-white-react .dropdown-toggle {
          cursor: pointer !important;
        }
        .fivecred-header-white-react .dropdown-menu {
          position: absolute !important;
          top: 100% !important;
          left: 50% !important;
          transform: translateX(-50%) translateY(10px) !important;
          min-width: 260px !important;
          background-color: #ffffff !important;
          box-shadow: 0 12px 32px rgba(0,0,0,0.08) !important;
          border: 1px solid rgba(0, 0, 0, 0.06) !important;
          border-radius: 8px !important;
          padding: 0.5rem 0 !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          transition: all 0.2s ease !important;
          z-index: 10010 !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .fivecred-header-white-react .dropdown:hover .dropdown-menu {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transform: translateX(-50%) translateY(0) !important;
        }
        .fivecred-header-white-react .dropdown-menu a {
          display: block !important;
          padding: 0.75rem 1.5rem !important;
          color: #334155 !important;
          font-weight: 500 !important;
          font-size: 0.9rem !important;
          text-align: left !important;
          transition: background-color 0.2s ease, color 0.2s ease !important;
          border-radius: 4px !important;
          margin: 0 0.25rem !important;
        }
        .fivecred-header-white-react .dropdown-menu a:hover {
          background-color: rgba(0, 0, 0, 0.02) !important;
          color: #ff6b00 !important;
        }
        .fivecred-header-white-react .nav-actions {
          display: flex !important;
          align-items: center !important;
          gap: 1rem !important;
        }
        .fivecred-header-white-react .btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-decoration: none !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          transition: all 0.3s ease !important;
          border-radius: 4px !important;
          cursor: pointer !important;
        }
        .fivecred-header-white-react .btn-outline {
          background: transparent !important;
          color: #0f172a !important;
          border: 1px solid rgba(0, 0, 0, 0.15) !important;
          padding: 0.6rem 1.25rem !important;
        }
        .fivecred-header-white-react .btn-outline:hover {
          border-color: #0f172a !important;
          background: rgba(0,0,0,0.02) !important;
        }
        .fivecred-header-white-react .btn-primary {
          background-color: #ff6b00 !important;
          color: #ffffff !important;
          padding: 0.6rem 1.25rem !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.15) !important;
        }
        .fivecred-header-white-react .btn-primary:hover {
          background-color: #ff7a1a !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 16px rgba(255, 107, 0, 0.25) !important;
        }
        .fivecred-header-white-react .mobile-menu-toggle {
          display: none !important;
          background: none !important;
          border: none !important;
          font-size: 1.5rem !important;
          cursor: pointer !important;
          color: #0f172a !important;
          padding: 0.5rem !important;
        }
        @media (max-width: 1023px) {
          .fivecred-header-white-react .nav-links {
            display: none !important;
            flex-direction: column !important;
            position: absolute !important;
            top: 80px !important;
            left: 0 !important;
            width: 100% !important;
            background-color: #ffffff !important;
            padding: 2rem !important;
            border-bottom: 1px solid rgba(0,0,0,0.06) !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
            z-index: 9999 !important;
            gap: 1.5rem !important;
            align-items: flex-start !important;
          }
          .fivecred-header-white-react .nav-links.active-menu {
            display: flex !important;
          }
          .fivecred-header-white-react .dropdown-menu {
            position: static !important;
            transform: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding-left: 1.5rem !important;
            margin-top: 0.5rem !important;
            display: none !important;
            align-items: flex-start !important;
          }
          .fivecred-header-white-react .dropdown.active-dropdown .dropdown-menu {
            display: flex !important;
          }
          .fivecred-header-white-react .nav-actions .btn-outline {
            display: none !important;
          }
          .fivecred-header-white-react .mobile-menu-toggle {
            display: block !important;
          }
        }
        @media (max-width: 639px) {
          .fivecred-header-white-react .nav-actions .btn-primary {
            display: none !important;
          }
        }
      ` }} />
      <div className="nav-container">
        <div className="logo">
          <a href="https://fivecred.com.br" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20FiveCred-pzEDmFzRMY9X8vyYzZIwVm4uvmCmya.png"
              alt="FiveCred Logo"
              className="logo-icon"
            />
          </a>
        </div>
        
        <nav className={`nav-links ${open ? "active-menu" : ""}`}>
          <a href="https://fivecred.com.br/#quem-somos" className="nav-item">Quem Somos</a>
          <div 
            className={`dropdown ${dropdownOpen ? "active-dropdown" : ""}`}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <a 
              className="dropdown-toggle"
              onClick={(e) => {
                if (window.innerWidth < 1024) {
                  e.preventDefault();
                  setDropdownOpen(!dropdownOpen);
                }
              }}
            >
              Produtos <ChevronDown style={{ width: "16px", height: "16px", display: "inline-block", verticalAlign: "middle" }} />
            </a>
            <div className="dropdown-menu">
              <a href="https://emprestimo-com-garantia-para-veiculo.fivecred.com.br">Garantia de Veículo</a>
              <a href="https://imovel-fivecred.vercel.app">Garantia de Imóvel</a>
              <a href="https://consignado-fivecred.vercel.app">Consignado INSS</a>
              <a href="https://emprestimo-consignado-clt.fivecred.com.br/">CLT</a>
              <a href="https://luz-fivecred.vercel.app">Conta de Luz</a>
              <a href="https://bolsa-fivecred.vercel.app">Bolsa Família</a>
            </div>
          </div>
          <a href="https://fivecred.com.br/#contato" className="nav-item">Contato</a>
        </nav>
        
        <div className="nav-actions">
          <a href="https://app.fivecred.online/registrar" className="btn btn-outline">Seja nosso Afiliado</a>
          <a href="https://wa.me/5511981655768?text=Quero%20falar%20com%20um%20consultor!" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Falar com Consultor</a>
          <button className="mobile-menu-toggle" aria-label="Abrir menu" onClick={() => setOpen(!open)}>
            {open ? <X style={{ width: "24px", height: "24px" }} /> : <Menu style={{ width: "24px", height: "24px" }} />}
          </button>
        </div>
      </div>
    </header>
  );
}
