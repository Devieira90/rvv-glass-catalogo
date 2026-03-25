import { supabase } from '@/lib/supabase'

export const revalidate = 0;
interface Photo {
  id: string
  image_url: string
  caption: string
  category_id: string 
  categories: {
    name: string
  } | null 
}

export default async function Home() {
  // A query do Supabase continua a mesma
  const { data, error } = await supabase
    .from('photos')
    .select(`
      id,
      image_url,
      caption,
      category_id,
      categories (
        name
      )
    `)
    .order('created_at', { ascending: false });

  const photos = (data as unknown as Photo[]) || [];

  if (error) {
    return <div className="p-10 text-red-500 font-mono text-center">Erro ao carregar catálogo: {error.message}</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* Header Profissional */}
      <header className="bg-white border-b border-slate-100 py-12 px-6 mb-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-blue-950 tracking-tighter">RVV GLASS</h1>
          <p className="mt-3 text-lg text-slate-600">Serviços em Vidro e Alumínio em Belford Roxo</p>
          <div className="mt-5 w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6">
        {/* Grid Responsivo (Otimizado para o celular do cliente) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {photos.map((photo) => (
            <article key={photo.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-2xl hover:border-blue-100 transition-all duration-300">
              
              {/* O PULO DO GATO: Container para mostrar a imagem TODA */}
              <div className="aspect-[4/3] w-full relative bg-slate-100/50 p-2">
                <img 
                  src={photo.image_url} 
                  alt={photo.caption}
                  // Usamos 'object-contain' para ela caber inteira sem corte
                  className="object-contain w-full h-full rounded-xl transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              
              {/* Informações da Foto */}
              <div className="p-7">
                <div className="flex items-center gap-3">
                  <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 rounded-full">
                    {photo.categories?.name || 'Sem Categoria'}
                  </span>
                </div>
                
                {/* Legenda com altura fixa para alinhamento */}
                <h3 className="mt-5 text-gray-800 font-semibold text-lg leading-snug h-14 line-clamp-2">
                  {photo.caption}
                </h3>

                {/* Botão de WhatsApp Dinâmico (Tarefa ID 7) */}
                <a 
                  // Não esqueça de trocar o 5521... pelo seu número real de contato
                  href={`https://wa.me/5521999999999?text=Olá! Vi essa foto no catálogo: "${photo.caption}". Gostaria de um orçamento.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-green-100"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.56 5.333-11.891 11.893-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99 0-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-2.531c1.566.928 3.545 1.437 5.242 1.437 5.46 0 9.893-4.433 9.895-9.891.001-2.646-1.032-5.131-2.906-7.005-1.875-1.874-4.361-2.907-7.008-2.907-5.457 0-9.891 4.434-9.892 9.892-.001 1.916.556 3.784 1.612 5.355l-.995 3.634 3.718-.975z"/>
                  </svg>
                  Pedir Orçamento no WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}