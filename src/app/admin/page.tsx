'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
  const [loading, setLoading] = useState(false)
  
  // Estados do Formulário
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        fetchCategories()
      }
    }
    checkUser()
  }, [router])

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('id, name')
    if (data) setCategories(data)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !categoryId) return alert('Selecione uma imagem e uma categoria!')

    setLoading(true)

    try {
      // 1. Gerar nome único para o arquivo (evita sobrescrever fotos com mesmo nome)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      // 2. Upload para o Storage (Bucket: catalogo-fotos)
      const { error: uploadError } = await supabase.storage
        .from('catalogo-fotos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. Pegar a URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('catalogo-fotos')
        .getPublicUrl(filePath)

      // 4. Salvar na tabela 'photos' do banco SQL
      const { error: dbError } = await supabase
        .from('photos')
        .insert([
          { 
            image_url: publicUrl, 
            caption: caption, 
            category_id: categoryId 
          }
        ])

      if (dbError) throw dbError

      alert('Foto enviada com sucesso para a Rvv Glass!')
      setCaption('')
      setFile(null)
      // Opcional: recarregar a página ou limpar o input de file
    } catch (error: any) {
      alert('Erro no upload: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <p className="p-10 text-center">Verificando acesso...</p>

  return (
    <main className="p-6 max-w-2xl mx-auto bg-white min-h-screen shadow-lg">
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <h1 className="text-2xl font-black text-blue-900">PAINEL RVV GLASS</h1>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} 
                className="text-red-500 text-sm font-bold">SAIR</button>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <h2 className="text-lg font-bold text-slate-700">Nova Foto no Catálogo</h2>
        
        {/* Input de Arquivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Serviço</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Seleção de Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
          <select 
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma categoria...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Legenda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Legenda (Descrição)</label>
          <textarea 
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Ex: Box de Canto, Vidro Incolor 8mm..."
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all disabled:bg-slate-300"
        >
          {loading ? 'Subindo Foto...' : 'Publicar no Catálogo'}
        </button>
      </form>
    </main>
  )
}