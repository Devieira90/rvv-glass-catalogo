'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export default function AdminPanel() {
  const [user, setUser] = useState<User | null>(null)
  const [view, setView] = useState<'photos' | 'categories'>('photos')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Estados para Fotos
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [categoryId, setCategoryId] = useState('')

  // Estado para Nova Categoria
  const [newCatName, setNewCatName] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push('/login')
      } else {
        setUser(currentUser)
        fetchCategories()
      }
    }
    checkUser()
  }, [router])

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('id, name').order('name')
    if (data) setCategories(data)
  }

  // --- LOGICA DE CATEGORIAS ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName) return
    setLoading(true)
    const { error } = await supabase.from('categories').insert([{ name: newCatName }])
    if (error) alert("Erro ao criar: " + error.message)
    else {
      setNewCatName('')
      fetchCategories()
    }
    setLoading(false)
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Tem certeza? Isso pode afetar fotos ligadas a esta categoria.")) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) alert("Erro: Verifique se existem fotos nesta categoria antes de excluir.")
    else fetchCategories()
  }

  // --- LOGICA DE UPLOAD DE FOTOS ---
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !categoryId) return alert('Selecione imagem e categoria!')
    setLoading(true)
    try {
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`
      const { error: upErr } = await supabase.storage.from('catalogo-fotos').upload(fileName, file)
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('catalogo-fotos').getPublicUrl(fileName)
      const { error: dbErr } = await supabase.from('photos').insert([{ image_url: publicUrl, caption, category_id: categoryId }])
      if (dbErr) throw dbErr
      alert('Foto publicada!')
      setCaption(''); setFile(null);
    } catch (err: any) { alert(err.message) }
    finally { setLoading(false) }
  }

  if (!user) return <p className="p-10 text-center">Verificando...</p>

  return (
    <main className="p-6 max-w-2xl mx-auto bg-white min-h-screen text-slate-800">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-xl font-bold text-teal-700">RVV ADMIN</h1>
        <div className="flex gap-4">
          <button onClick={() => setView('photos')} className={`text-sm ${view === 'photos' ? 'font-bold underline' : ''}`}>Fotos</button>
          <button onClick={() => setView('categories')} className={`text-sm ${view === 'categories' ? 'font-bold underline' : ''}`}>Categorias</button>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="text-red-500 text-sm">Sair</button>
        </div>
      </div>

      {view === 'photos' ? (
        <form onSubmit={handleUpload} className="space-y-4">
          <h2 className="font-bold">Nova Foto</h2>
          <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="w-full border p-2 rounded" />
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Selecione a Categoria</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Legenda (ex: Box de Abrir)" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full p-2 border rounded" />
          <button disabled={loading} className="w-full bg-teal-600 text-white p-3 rounded-xl font-bold">
            {loading ? 'Processando...' : 'Postar no Catálogo'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <h2 className="font-bold">Gerenciar Categorias</h2>
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input 
              placeholder="Ex: Espelhos Bisotados" 
              value={newCatName} 
              onChange={(e) => setNewCatName(e.target.value)} 
              className="flex-1 p-2 border rounded"
            />
            <button  className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold">+</button>
          </form>

          <ul className="divide-y border rounded-xl overflow-hidden">
            {categories.map(cat => (
              <li key={cat.id} className="p-4 flex justify-between items-center bg-slate-50">
                <span>{cat.name}</span>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)} 
                  className="text-red-500 text-sm font-bold border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}