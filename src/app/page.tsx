import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 0;

interface Photo {
  id: string
  image_url: string
  caption: string
  category_id: string
  categories: {
    id: string
    name: string
  } | null
}

// O Next.js passa os parâmetros da URL (searchParams) para a função
export default async function Home({ searchParams }: { searchParams: { cat?: string } }) {
  
  // 1. Buscar Categorias para os Botões de Filtro
  const { data: categories } = await supabase.from('categories').select('id, name').order('name');

  // 2. Montar a Query de Fotos
  let query = supabase
    .from('photos')
    .select('id, image_url, caption, category_id, categories(id, name)')
    .order('created_at', { ascending: false });

  // Se o usuário clicou em um filtro, filtramos no banco!
  if (searchParams.cat) {
    query = query.eq('category_id', searchParams.cat);
  }

  const { data: photos, error } = await query;

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-100 py-10 px-6 text-center">
        <h1 className="text-4xl font-black text-blue-950 tracking-tight">RVV GLASS</h1>
        <p className="mt-2 text-slate-500">Qualidade e transparência em cada projeto</p>
      </header>

      {/* --- TAREFA ID 5: FILTROS DE CATEGORIA --- */}
      <nav className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          {/* Botão "Todos" */}
          <Link 
            href="/"
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${!searchParams.cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            Todos
          </Link>

          {/* Botões Dinâmicos das suas Categorias do Banco */}
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              href={`/?cat=${cat.id}`}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${searchParams.cat === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6">
        {photos?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Nenhum serviço encontrado nesta categoria.</p>
            <Link href="/" className="mt-4 inline-block text-blue-600 font-bold underline">Ver tudo</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos?.map((photo) => (
              <article key={photo.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/3] w-full relative bg-slate-50 p-3">
                  <img 
                    src={photo.image_url} 
                    alt={photo.caption}
                    className="object-contain w-full h-full rounded-xl group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {photo.categories?.name}
                  </span>
                  <h3 className="mt-4 text-slate-800 font-semibold text-lg leading-snug h-12 line-clamp-2">
                    {photo.caption}
                  </h3>
                  <a 
                    href={`https://wa.me/5521999999999?text=Olá! Vi essa foto no catálogo: "${photo.caption}"`}
                    target="_blank"
                    className="mt-6 flex items-center justify-center w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#1da851] transition-all shadow-md"
                  >
                    Orçamento no WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}