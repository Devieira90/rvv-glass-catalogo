'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export default function AdminPanel() {
  const [user, setUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push('/login')
      } else {
        setUser(currentUser)
        const { data } = await supabase.from('categories').select('id, name')
        if (data) setCategories(data)
      }
    }
    checkUser()
  }, [router])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !categoryId) return alert('Selecione uma imagem e uma categoria!')
    setLoading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('catalogo-fotos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('catalogo-fotos')
        .getPublicUrl(fileName)

      const { error: dbError } = await supabase
        .from('photos')
        .insert([{ image_url: publicUrl, caption, category_id: categoryId }])

      if (dbError) throw dbError

      alert('Foto enviada com sucesso!')
      setCaption('')
      setFile(null)
    } catch (err: unknown) {
      const error = err as Error
      alert('Erro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <p className="p-10 text-center text-slate-500">Verificando acesso...</p>

  return (
    <main className="p-6 max-w-2xl mx-auto bg-white min-h-screen">
      <div className="flex justify-between items-center mb-10 border-b pb-6 text-slate-900">
        <h1 className="text-2xl font-black">PAINEL RVV GLASS</h1>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} 
                className="text-red-500 text-sm font-bold">SAIR</button>
      </div>
      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Imagem</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="w-full text-slate-500" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Categoria</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-3 border rounded-xl text-slate-900">
            <option value="">Selecione...</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Legenda</label>
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full p-3 border rounded-xl text-slate-900" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl disabled:bg-slate-300">
          {loading ? 'Subindo...' : 'Publicar'}
        </button>
      </form>
    </main>
  )
}