# 🪟 RVV GLASS - Catálogo Digital

O **RVV GLASS** é um catálogo digital moderno e responsivo desenvolvido para facilitar a exibição de serviços de vidraçaria e serralheria de alumínio. O projeto permite que o administrador gerencie fotos de serviços realizados, enquanto os clientes podem filtrar por categorias e solicitar orçamentos via WhatsApp de forma dinâmica.

## 🚀 Tecnologias

Este projeto foi construído com o que há de mais moderno no ecossistema Web:

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Banco de Dados & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Storage:** Supabase Storage (para hospedagem das imagens)
- **Deploy:** [Vercel](https://vercel.com/)

## 🛠️ Desafios Técnicos & Soluções (Case de Sucesso)

Durante o desenvolvimento, enfrentei um desafio de compatibilidade de hardware. O ambiente de desenvolvimento utiliza um processador **Intel Core i5 de 2ª Geração (Sandy Bridge)**, que não possui suporte às instruções **BMI2** exigidas pelo compilador SWC (Rust) nativo do Next.js moderno.

**Solução:** Implementei uma configuração personalizada via `.babelrc` para desativar o SWC e forçar o uso do **Babel**. Isso garantiu a estabilidade do ambiente de desenvolvimento sem comprometer as funcionalidades do Next.js 14, permitindo a conclusão da Sprint 1 com sucesso.

## ✨ Funcionalidades

- **Dashboard Administrativo:** Login seguro para upload de fotos e gerenciamento de categorias.
- **Filtro Inteligente:** Filtros dinâmicos via URL que permitem ao cliente navegar por categorias (Ex: Box, Janelas, Espelhos).
- **Mensagens Dinâmicas:** Integração com a API do WhatsApp que já envia a descrição do produto escolhido para o vendedor.
- **Design Responsivo:** Interface otimizada para dispositivos móveis, facilitando o uso por clientes no dia a dia.

## 📦 Como Instalar e Rodar

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/Devieira90/rvv-glass-catalogo.git](https://github.com/Devieira90/rvv-glass-catalogo.git)