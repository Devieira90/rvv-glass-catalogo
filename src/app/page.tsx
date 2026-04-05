import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 0;

export default async function Home({ searchParams }: { searchParams: { cat?: string } }) {
  const { data: categories } = await supabase.from('categories').select('id, name').order('name');

  let query = supabase
    .from('photos')
    .select('id, image_url, caption, category_id, categories(id, name)')
    .order('created_at', { ascending: false });

  if (searchParams?.cat) {
    query = query.eq('category_id', searchParams.cat);
  }

  const { data: photos } = await query;

  return (
    <main className="min-h-screen pb-20" style={{ background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)' }}>
      {/* Header com gradiente suave */}
      <header className="bg-gradient-to-r from-teal-50 via-teal-100 to-teal-50 border-b border-teal-200 py-10 px-6 text-center shadow-sm">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-600 tracking-tight">
          RVV GLASS
        </h1>
        <p className="mt-3 text-teal-700 font-medium">Qualidade e transparência em cada projeto</p>
      </header>

      <nav className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          <Link 
            href="/" 
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 ${
              !searchParams?.cat 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-300' 
                : 'bg-white/90 backdrop-blur-sm text-teal-700 border-2 border-teal-200 hover:bg-teal-50'
            }`}
          >
            Todos
          </Link>


          {categories?.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/?cat=${cat.id}`} 
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 ${
                searchParams?.cat === cat.id 
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-300' 
                  : 'bg-white/90 backdrop-blur-sm text-teal-700 border-2 border-teal-200 hover:bg-teal-50'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6">
        {photos?.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-teal-300">
            <p className="text-teal-600 font-medium text-lg">Nenhum serviço encontrado nesta categoria.</p>
            <Link href="/" className="mt-4 inline-block text-teal-700 font-bold underline hover:text-teal-900 transition-colors">
              Ver tudo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos?.map((photo) => (
              <article key={photo.id} className="bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/3] w-full relative bg-gradient-to-br from-teal-50 to-teal-100 p-3">
                  <Image 
  src={photo.image_url} 
  alt={photo.caption} 
  fill
  className="object-contain w-full h-full rounded-xl group-hover:scale-105 transition-transform duration-500" 
/>
                </div>
                <div className="p-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-3 py-1.5 rounded-full inline-block">
                   {(photo.categories as { name: string }[])?.[0]?.name}
                  </span>
                  <h3 className="mt-4 font-semibold text-lg leading-snug min-h-[3.5rem] line-clamp-2 text-slate-800">
                    {photo.caption}
                  </h3>
                  <a 
                    href={`https://wa.me/5521990641623?text=Olá! Vi essa foto no catálogo: "${photo.caption}"`} 
                    target="_blank" 
                    className="mt-6 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold py-4 rounded-xl hover:from-[#20b859] hover:to-[#0e6b5e] transition-all shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.277-.582c.948.502 2.008.766 3.054.766 3.18 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.766-5.768-5.766zm0 10.533c-1.06 0-2.076-.276-2.966-.791l-.211-.124-1.353.346.352-1.306-.128-.219c-.558-.914-.854-1.97-.854-3.056 0-3.181 2.587-5.768 5.768-5.768s5.768 2.587 5.768 5.768c0 3.181-2.587 5.768-5.768 5.768z"/>
                    </svg>
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