import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_USERNAME = 'KDJLUXURY'
const ADMIN_PASSWORD = 'KDJ123@'
const API_URL = import.meta.env.VITE_API_URL || 'https://kdj-luxury-api.vercel.app/'
const API_URL_2 = import.meta.env.VITE_API_URL_2 || 'http://localhost:3001'

interface Product {
  id: number
  name: string
  cat: string
  price: string
  oldPrice: string
  badge: string
  img: string
}

interface Settings {
  phone: string
  name: string
  greeting: string
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [adminTab, setAdminTab] = useState('add')
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<Settings>({
    phone: '+2349039917087',
    name: 'KDJ Premium Bags',
    greeting: "Hello! I'm interested in your bags collection.",
  })
  const [formData, setFormData] = useState({
    name: '',
    cat: 'tote',
    price: '',
    oldPrice: '',
    imgUrl: '',
    badge: '',
    desc: '',
  })
  const [settingsForm, setSettingsForm] = useState({
    phone: '+2349039917087',
    name: 'KDJ Premium Bags',
    greeting: "Hello! I'm interested in your bags collection.",
  })
  const [adminImgData, setAdminImgData] = useState<string | null>(null)
  const [useApi2, setUseApi2] = useState(false)
  const [apiStatus, setApiStatus] = useState<'primary' | 'fallback'>('primary')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const username = (form.elements.namedItem('username') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAdminLoggedIn(true)
      setLoginError('')
      loadProducts()
      loadSettings()
    } else {
      setLoginError('Invalid credentials')
    }
  }

  const loadProducts = async () => {
    try {
      const res = await fetch(useApi2 ? API_URL_2 + '/products' : API_URL + 'products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
        setApiStatus('primary')
      }
    } catch {
      if (!useApi2) {
        setApiStatus('fallback')
        try {
          const res2 = await fetch(API_URL_2 + '/products')
          const data = await res2.json()
          setProducts(data)
        } catch {}
      }
    }
  }

  const loadSettings = async () => {
    try {
      const res = await fetch(useApi2 ? API_URL_2 + '/settings' : API_URL + 'settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
        setSettingsForm(data)
      }
    } catch {}
  }

  const addProduct = async () => {
    if (!formData.name || !formData.price) return
    try {
      const res = await fetch(useApi2 ? API_URL_2 + '/products' : API_URL + 'products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        alert('Product added!')
        setFormData({ name: '', cat: 'tote', price: '', oldPrice: '', imgUrl: '', badge: '', desc: '' })
        loadProducts()
      }
    } catch {}
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Delete this product?')) return
    try {
      await fetch(useApi2 ? `${API_URL_2}/products/${id}` : `${API_URL}products/${id}`, { method: 'DELETE' })
      loadProducts()
    } catch {}
  }

  const saveSettings = async () => {
    try {
      await fetch(useApi2 ? API_URL_2 + '/settings' : API_URL + 'settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      })
      alert('Settings saved!')
      setSettings(settingsForm)
    } catch {}
  }

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setAdminImgData(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  if (!adminLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-white p-8 sm:p-12 max-w-md w-full mx-4 rounded">
          <div className="font-cormorant text-gold text-3xl font-light tracking-widest text-center mb-8">KDJ Admin Login</div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Username</label>
              <input type="text" name="username" className="px-4 py-3 border border-[#e0e0e0] rounded text-sm outline-none focus:border-gold transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Password</label>
              <input type="password" name="password" className="px-4 py-3 border border-[#e0e0e0] rounded text-sm outline-none focus:border-gold transition-colors" />
            </div>
            {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
            <button type="submit" className="mt-4 px-6 py-3 bg-black text-gold border-none text-[12px] tracking-widest uppercase cursor-pointer hover:bg-gold-dark hover:text-white transition-all">
              Login
            </button>
            <button type="button" onClick={() => navigate('/')} className="text-center text-[12px] text-text-mid hover:text-gold transition-colors">
              ← Back to Website
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black px-4 sm:px-8 py-6 flex items-center justify-between">
        <h2 className="font-cormorant text-gold text-[28px] font-light tracking-[4px]">KDJ Admin Panel</h2>
        <button onClick={() => { setAdminLoggedIn(false); navigate('/') }} className="bg-transparent border border-white/20 text-white w-9 h-9 rounded-full cursor-pointer text-lg flex items-center justify-center hover:bg-white/10 transition-all">✕</button>
      </div>
      <div className="flex border-b border-[#e8e8e8] overflow-x-auto">
        {['add', 'manage', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setAdminTab(tab)}
            className={`px-4 sm:px-7 py-4 border-none bg-transparent text-[13px] tracking-widest uppercase cursor-pointer transition-all font-sans ${adminTab === tab ? 'text-gold-dark border-b-2 border-gold' : 'text-text-mid border-b-2 border-transparent'}`}
          >
            {tab === 'add' ? 'Add Product' : tab === 'manage' ? 'Manage Products' : 'Settings'}
          </button>
        ))}
      </div>

      {adminTab === 'add' && (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Product Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Milano Leather Tote" className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Category</label>
                <select value={formData.cat} onChange={(e) => setFormData({ ...formData, cat: e.target.value })} className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors">
                  {['tote', 'crossbody', 'clutch', 'backpack', 'satchel', 'shoulder', 'mini'].map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Price (₦)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="e.g. 45000" className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Old Price (₦) – optional</label>
                <input type="number" value={formData.oldPrice} onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })} placeholder="e.g. 60000" className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Image URL (from Unsplash or any URL)</label>
              <input type="text" value={formData.imgUrl} onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })} placeholder="https://images.unsplash.com/..." className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Or Upload Image</label>
              <input type="file" accept="image/*" onChange={handleImgUpload} className="text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Badge (optional)</label>
                <select value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors">
                  {['None', 'New', 'Sale', 'Hot', 'Limited'].map((b) => (
                    <option key={b} value={b === 'None' ? '' : b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Description (optional)</label>
                <textarea value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} placeholder="Brief description..." className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors resize-vertical min-h-[80px]" />
              </div>
            </div>
            <button onClick={addProduct} className="self-start px-8 py-3.5 bg-black text-gold border-none text-[12px] tracking-widest uppercase cursor-pointer hover:bg-gold-dark hover:text-white transition-all">
              Add Product to Store
            </button>
          </div>
        </div>
      )}

      {adminTab === 'manage' && (
        <div className="p-4 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {products.map((p) => (
              <div key={p.id} className="border border-[#e8e8e8] rounded-sm overflow-hidden">
                <img src={p.img} alt={p.name} loading="lazy" className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <h4 className="text-sm mb-1 truncate">{p.name}</h4>
                  <p className="text-[13px] text-text-mid">{p.price} · {p.cat}</p>
                  <button onClick={() => deleteProduct(p.id)} className="w-full mt-2 py-2 bg-[#fee] border border-[#fcc] text-[#c00] text-[12px] cursor-pointer hover:bg-[#fcc] transition-all">
                    Delete Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminTab === 'settings' && (
        <div className="p-4 sm:p-8 max-w-2xl">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">WhatsApp Phone Number</label>
              <input type="text" value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} placeholder="+234..." className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Store Name</label>
              <input type="text" value={settingsForm.name} onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })} className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">WhatsApp Greeting Message</label>
              <textarea value={settingsForm.greeting} onChange={(e) => setSettingsForm({ ...settingsForm, greeting: e.target.value })} className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors resize-vertical min-h-[80px]" />
            </div>
            <button onClick={saveSettings} className="self-start px-8 py-3.5 bg-black text-gold border-none text-[12px] tracking-widest uppercase cursor-pointer hover:bg-gold-dark hover:text-white transition-all">
              Save Settings
            </button>
            <div className="flex items-center gap-3 pt-4 border-t border-[#e8e8e8]">
              <span className="text-[11px] tracking-widest uppercase text-text-mid font-medium">API Backend:</span>
              <button onClick={() => setUseApi2(!useApi2)} className={`px-4 py-2 text-[11px] tracking-widest uppercase border cursor-pointer transition-all ${useApi2 ? 'bg-gold border-gold-dark text-black' : 'bg-transparent border-[#e0e0e0] text-text-mid hover:border-gold'}`}>
                {useApi2 ? 'Backend 2 (Vercel)' : 'Backend 1 (Local)'}
              </button>
              <span className={`w-2 h-2 rounded-full ${apiStatus === 'fallback' ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <span className="text-[11px] text-text-mid">{apiStatus === 'fallback' ? 'Using fallback' : 'Primary active'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
