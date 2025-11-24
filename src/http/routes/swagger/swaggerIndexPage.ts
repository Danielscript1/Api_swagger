export interface Doc {
  link: string;
  title: string;
  description: string;
}

export function docIndex(params: Doc[]): string {
  const baseHtml = `
  <!DOCTYPE html>
  <html lang="pt-br">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Documentação da API</title>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          background: linear-gradient(135deg, #008CFF 0%, #0066CC 100%);
          min-height: 100vh;
          padding: 1.5rem 1rem;
        }
  
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }
  
        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .logo {
          width: 80px;
          height: auto;
        }

        .logo path {
          fill: #008CFF !important;
        }

        h1 {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0;
          color: #2d3748;
          background: linear-gradient(45deg, #008CFF, #0066CC);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          text-align: center;
          font-size: 1rem;
          color: #718096;
          margin-bottom: 0;
          font-weight: 300;
        }
  
        .api-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
  
        .api-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }

        .api-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .api-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #008CFF, #0066CC);
        }
  
        .api-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-bottom: 1px solid #e2e8f0;
        }

        .api-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .api-title i {
          color: #008CFF;
        }
  
        .api-description {
          font-size: 0.9rem;
          color: #718096;
          line-height: 1.5;
        }
  
        .api-actions {
          padding: 1.25rem 1.5rem;
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.2rem;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          outline: none;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn-primary {
          background: linear-gradient(135deg, #008CFF 0%, #0066CC 100%);
          color: white;
          flex: 1;
          justify-content: center;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 140, 255, 0.3);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          min-width: 120px;
          justify-content: center;
        }

        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(72, 187, 120, 0.3);
        }

        .stats {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #008CFF;
          display: block;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #718096;
          margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
            margin: 0.5rem;
          }

          .logo-container {
            flex-direction: column;
            gap: 0.5rem;
          }

          .logo {
            width: 60px;
          }

          h1 {
            font-size: 1.8rem;
          }

          .api-actions {
            flex-direction: column;
          }

          .btn {
            justify-content: center;
          }

          .stats {
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 1.5rem;
            padding: 1rem;
          }

          .api-grid {
            grid-template-columns: 1fr;
          }
        }

        .fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
    </head>
    <body>
      <div class="container fade-in">
        <div class="header">
          <div class="logo-container">
            <i class="fas fa-server"></i>
            <h1>Documentação de API</h1>
          </div>
          <p class="subtitle">Explore nossa documentação completa da API com endpoints organizados e exemplos práticos</p>
        </div>
        
        <div class="api-grid">
          ${params
            .map(
              (doc, index) => `
            <div class="api-card" style="animation-delay: ${index * 0.1}s">
              <div class="api-header">
                <h3 class="api-title">
                  <i class="fas fa-server"></i>
                  ${doc.title}
                </h3>
                <p class="api-description">${doc.description}</p>
              </div>
              <div class="api-actions">
                <a href="${doc.link}" class="btn btn-primary">
                  <i class="fas fa-book-open"></i>
                  Acessar Documentação
                </a>
                <a href="${
                  doc.link
                }/swagger.json" class="btn btn-secondary" download="swagger.json">
                  <i class="fas fa-download"></i>
                  swagger.json
                </a>
              </div>
            </div>
            `
            )
            .join("")}
        </div>

        <div class="stats">
          <div class="stat-item">
            <span class="stat-number">${params.length}</span>
            <div class="stat-label">APIs Disponíveis</div>
          </div>
          <div class="stat-item">
            <span class="stat-number">OpenAPI 3.0</span>
            <div class="stat-label">Padrão</div>
          </div>
          <div class="stat-item">
            <span class="stat-number">JSON</span>
            <div class="stat-label">Formatos</div>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

  return baseHtml;
}



