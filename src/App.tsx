import { useState, useEffect } from 'react'

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

const ADMIN_USERNAME = 'KDJLUXURY'
const ADMIN_PASSWORD = 'KDJ123@'
const API_URL = import.meta.env.VITE_API_URL || 'https://kdj-luxury-api.vercel.app/'
const API_URL_2 = import.meta.env.VITE_API_URL_2 || 'http://localhost:3001'

const initialProducts: Product[] = [
  { id: 1, name: 'Milano Structured Tote', cat: 'tote', price: '₦45,000', oldPrice: '₦60,000', badge: 'Sale', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop' },
  { id: 2, name: 'Venice Crossbody', cat: 'crossbody', price: '₦32,000', oldPrice: '', badge: 'New', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop' },
  { id: 3, name: 'Pearl Clutch Evening', cat: 'clutch', price: '₦18,500', oldPrice: '', badge: '', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=500&fit=crop' },
  { id: 4, name: 'Alpine Leather Backpack', cat: 'backpack', price: '₦68,000', oldPrice: '₦85,000', badge: 'Sale', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop' },
  { id: 5, name: 'Roma Satchel', cat: 'satchel', price: '₦54,000', oldPrice: '', badge: 'Hot', img: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=500&fit=crop' },
  { id: 6, name: 'Noir Shoulder Bag', cat: 'shoulder', price: '₦41,000', oldPrice: '', badge: '', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop' },
  { id: 7, name: 'Bijou Mini Bag', cat: 'mini', price: '₦22,000', oldPrice: '₦28,000', badge: 'Sale', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop' },
  { id: 8, name: 'Florence Tote Grande', cat: 'tote', price: '₦72,000', oldPrice: '', badge: 'New', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=500&fit=crop' },
]

const heroImages = [
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1920&q=80',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1920&q=80',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1920&q=80',
  'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=1920&q=80',
]

function App() {
  const [loaderHidden, setLoaderHidden] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [displayedCount, setDisplayedCount] = useState(24)
  const [products, setProducts] = useState<Product[]>([...initialProducts])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    phone: '+2349039917087',
    name: 'KDJ Premium Bags',
    greeting: "Hello! I'm interested in your bags collection.",
  })
  const [waOpen, setWaOpen] = useState(false)
  const [waInput, setWaInput] = useState('')
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null)
  const [toast, setToast] = useState('')
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminTab, setAdminTab] = useState('add')
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [adminImgData, setAdminImgData] = useState<string | null>(null)
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
  const [useApi2, setUseApi2] = useState(false)
  const [apiStatus, setApiStatus] = useState<'primary' | 'fallback'>('primary')

  useEffect(() => {
    const timer = setTimeout(() => setLoaderHidden(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2800)
      return () => clearTimeout(t)
    }
  }, [toast])

  useEffect(() => {
    fetchProducts()
    fetchSettings()
  }, [])

  const showToast = (msg: string) => setToast(msg)

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const getApiUrl = () => useApi2 && API_URL_2 ? API_URL_2 : API_URL

  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      const baseUrl = getApiUrl()
      const res = await fetch(`${baseUrl}/api/products`)
      const data = await res.json()
      setApiStatus(useApi2 ? 'fallback' : 'primary')
      const mapped = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        cat: p.cat,
        price: p.price,
        oldPrice: p.oldPrice || '',
        badge: p.badge || '',
        img: p.imgType === 'file' ? `${baseUrl}${p.img}` : p.img,
      }))
      setProducts([...initialProducts, ...mapped])
    } catch (error) {
      if (API_URL_2 && !useApi2) {
        setUseApi2(true)
        try {
          const res = await fetch(`${API_URL_2}/api/products`)
          const data = await res.json()
          setApiStatus('fallback')
          const mapped = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            cat: p.cat,
            price: p.price,
            oldPrice: p.oldPrice || '',
            badge: p.badge || '',
            img: p.imgType === 'file' ? `${API_URL_2}${p.img}` : p.img,
          }))
          setProducts([...initialProducts, ...mapped])
        } catch {
          setProducts([...initialProducts])
        }
      } else {
        setProducts([...initialProducts])
      }
    }
    setLoadingProducts(false)
  }

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/api/settings`)
      const data = await res.json()
      if (data.phone) {
        setSettings(data)
        setSettingsForm(data)
      }
    } catch (error) {
      console.log('Using default settings')
    }
  }

  const getFilteredProducts = () => {
    return products.filter((p) => {
      const matchCat = activeFilter === 'all' || p.cat === activeFilter
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.cat.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }

  const filterProducts = (cat: string, btn?: HTMLButtonElement) => {
    setActiveFilter(cat)
    setDisplayedCount(24)
    document.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('active'))
    if (btn) btn.classList.add('active')
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMore = () => {
    setDisplayedCount((prev) => prev + 12)
    showToast('More products loaded!')
  }

  const openLightbox = (product: Product) => {
    setLightboxProduct(product)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxProduct(null)
    document.body.style.overflow = ''
  }

  const enquireOnWA = () => {
    if (!lightboxProduct) return
    const msg = encodeURIComponent(
      `Hello KDJ Bags! I'm interested in the *${lightboxProduct.name}* (${lightboxProduct.price}). Is it available?`
    )
    window.open(
      `https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=${msg}`,
      '_blank'
    )
  }

  const quickWA = (name: string, price: string) => {
    const msg = encodeURIComponent(`Hi KDJ Bags! I'm interested in *${name}* (${price}). Is it available?`)
    window.open(`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank')
  }

  const waOption = (option: string) => {
    const messages: Record<string, string> = {
      'Browse collection': `Hello! I'd like to browse the KDJ Bags collection. What's available?`,
      'Check availability': `Hi! I want to check if a specific bag is available.`,
      'Pricing inquiry': `Hello! I'd like to know more about your pricing.`,
      'Custom order': `Hi KDJ! I'm interested in a custom order.`,
      'Shipping info': `Hello! Can you tell me about your shipping options?`,
    }
    const msg = encodeURIComponent(messages[option] || option)
    window.open(`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank')
  }

  const sendWA = () => {
    if (!waInput.trim()) return
    const msg = encodeURIComponent(waInput)
    window.open(`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank')
    setWaInput('')
  }

  const handleWAImage = () => {
    showToast('Opening WhatsApp to send your image...')
    const msg = encodeURIComponent(`Hi KDJ Bags! I'm looking for a bag similar to the image I'll send. Do you have it?`)
    window.open(`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank')
  }

  const openAdminLogin = () => {
    setAdminOpen(true)
    setAdminLoggedIn(false)
    setLoginError('')
  }

  const closeAdmin = () => {
    setAdminOpen(false)
    document.body.style.overflow = ''
  }

  const handleLogin = (username: string, password: string) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAdminLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid credentials')
    }
  }

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const username = (form.elements.namedItem('username') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    handleLogin(username, password)
  }

  const previewAdminImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAdminImgData(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const addProduct = async () => {
    const { name, cat, price, oldPrice, imgUrl, badge } = formData
    if (!name || !price) {
      showToast('Please fill in name and price')
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', name)
      formDataToSend.append('cat', cat)
      formDataToSend.append('price', '₦' + Number(price).toLocaleString())
      formDataToSend.append('oldPrice', oldPrice ? '₦' + Number(oldPrice).toLocaleString() : '')
      formDataToSend.append('badge', badge)

      // Handle image - either file upload or URL
      if (adminImgData) {
        // Convert data URL to blob
        const arr = adminImgData.split(',')
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
        const bstr = atob(arr[1])
        const n = bstr.length
        const u8arr = new Uint8Array(n)
        for (let i = 0; i < n; i++) {
          u8arr[i] = bstr.charCodeAt(i)
        }
        const blob = new Blob([u8arr], { type: mime })
        const fileName = `product-${Date.now()}.jpg`
        const file = new File([blob], fileName, { type: mime })
        formDataToSend.append('image', file)
      } else if (imgUrl) {
        // Use URL if no file uploaded
        formDataToSend.append('img', imgUrl)
      }

      const response = await fetch(`${getApiUrl()}/api/products`, {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        const newProduct = await response.json()
        setProducts((prev) => [{
          id: newProduct.id,
          name: newProduct.name,
          cat: newProduct.cat,
          price: newProduct.price,
          oldPrice: newProduct.oldPrice || '',
          badge: newProduct.badge || '',
          img: newProduct.imgType === 'file' ? `${getApiUrl()}${newProduct.img}` : newProduct.img,
        }, ...prev])
        showToast('Product added successfully!')
        setFormData({ name: '', cat: 'tote', price: '', oldPrice: '', imgUrl: '', badge: '', desc: '' })
        setAdminImgData(null)
      } else {
        const errorData = await response.json()
        showToast(`Failed to add product: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error: any) {
      showToast(`Error: ${error.message || 'Failed to add product'}`)
      console.error('Add product error:', error)
    }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Delete this product?')) return
    try {
      const response = await fetch(`${getApiUrl()}/api/products/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        showToast('Product deleted')
      }
    } catch (error) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      showToast('Product deleted (offline)')
    }
  }

  const saveSettings = async () => {
    try {
      await fetch(`${getApiUrl()}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      })
    } catch (error) {
      console.log('Settings save offline')
    }
    setSettings(settingsForm)
    showToast('Settings saved!')
  }

  const waOptions = [
    { label: 'Browse Collection', icon: '🛍️' },
    { label: 'Check availability', icon: '✅' },
    { label: 'Pricing inquiry', icon: '💰' },
    { label: 'Custom order', icon: '✨' },
    { label: 'Shipping info', icon: '🚚' },
  ]

  const filtered = getFilteredProducts()
  const toShow = filtered.slice(0, displayedCount)

  return (
    <div className="min-h-screen bg-off-white text-text-dark font-sans">
      {/* LOADER */}
      <div
        className={`fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center gap-4 transition-opacity duration-800 ease-out ${loaderHidden ? 'opacity-0 invisible pointer-events-none' : ''
          }`}
      >
        <div className="font-cormorant text-gold text-6xl font-light tracking-[12px] animate-pulse">
          KDJ
        </div>
        <div className="w-[120px] h-[1px] bg-[#333] relative overflow-hidden">
          <div className="absolute inset-0 bg-gold animate-loadBar" />
        </div>
      </div>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 sm:px-6 md:px-12 h-[60px] sm:h-[72px] bg-black/97 backdrop-blur-[20px] border-b border-gold/20">
        <button onClick={() => { scrollTop(); setMobileMenuOpen(false) }} className="font-cormorant text-gold text-2xl sm:text-3xl font-light tracking-[4px] sm:tracking-[8px] cursor-pointer">
          KDJ
        </button>
        <div className="hidden md:flex gap-6 lg:gap-8 items-center">
          {['all', 'tote', 'crossbody', 'clutch', 'backpack', 'satchel'].map((cat) => (
            <button
              key={cat}
              onClick={() => filterProducts(cat)}
              className="text-white/70 text-[11px] lg:text-[13px] tracking-[1.5px] uppercase hover:text-gold transition-colors duration-300 cursor-pointer bg-transparent border-none"
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1) + 's'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
          <div className="flex items-center gap-2 bg-white/6 border border-gold/25 rounded-full px-2 sm:px-4 py-1.5">
            <span className="text-gold text-sm">⌕</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setDisplayedCount(24)
              }}
              className="bg-transparent border-none outline-none text-white text-[13px] w-16 sm:w-32 md:w-40 font-sans"
            />
          </div>
          <button
            onClick={openAdminLogin}
            className="bg-transparent border border-gold text-gold px-2 sm:px-4 py-1.5 rounded-full text-xs tracking-widest uppercase hover:bg-gold hover:text-black transition-all duration-300 cursor-pointer hidden sm:block"
          >
            Admin
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center cursor-pointer bg-transparent border-none"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-[1.5px] bg-gold transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-gold transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-gold transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[99] bg-black/95 backdrop-blur-[8px] transition-all duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className={`flex flex-col items-center justify-center h-full gap-6 transition-transform duration-300 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-10'}`}>
          {['all', 'tote', 'crossbody', 'clutch', 'backpack', 'satchel'].map((cat) => (
            <button
              key={cat}
              onClick={() => { filterProducts(cat); setMobileMenuOpen(false) }}
              className="text-white/70 text-lg tracking-[3px] uppercase hover:text-gold transition-colors duration-300 cursor-pointer bg-transparent border-none"
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1) + 's'}
            </button>
          ))}
          <button
            onClick={() => { openAdminLogin(); setMobileMenuOpen(false) }}
            className="mt-4 bg-transparent border border-gold text-gold px-6 py-2 rounded-full text-xs tracking-widest uppercase hover:bg-gold hover:text-black transition-all duration-300 cursor-pointer"
          >
            Admin
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="h-screen relative overflow-hidden flex items-center justify-center">
        {heroImages.map((url, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease ${i === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            style={{ backgroundImage: `url('${url}')` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
        <div className="relative z-10 text-center">
          <span className="text-gold text-[11px] tracking-[4px] uppercase inline-block mb-5 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>✦ Luxury Craftsmanship ✦</span>
          <h1 className="font-cormorant text-white font-light leading-[0.9] mb-6 text-[clamp(56px,9vw,120px)] animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            Carry<br /><em className="text-gold-light animate-textGlow" style={{ animationDelay: '1.2s' }}>Excellence</em>
          </h1>
          <p className="text-white/65 text-base tracking-wide mb-10 font-light animate-fadeInUp" style={{ animationDelay: '1.5s' }}>Premium bags crafted for the modern connoisseur</p>
          <button
            onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-3 bg-gold text-black px-10 py-4 text-[13px] tracking-[2px] uppercase font-medium hover:bg-gold-light hover:translate-x-1 transition-all duration-300 border-none cursor-pointer animate-fadeInUp"
            style={{ animationDelay: '1.8s' }}
          >
            Explore Collection →
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-[11px] tracking-[3px] uppercase animate-bounce z-10">
          <span>Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-black py-4 overflow-hidden border-t border-b border-gold/20">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...Array(2)].flatMap(() =>
            ['Premium Quality', 'Free Shipping Over ₦50k', 'New Arrivals Weekly', 'Authentic Designs', 'Handcrafted Excellence', 'Worldwide Delivery', 'WhatsApp Support', '1000+ Styles'].map((item, i) => (
              <span key={i} className="text-white/40 text-xs tracking-[3px] uppercase flex items-center gap-4">
                <span className="w-1 h-1 bg-gold rounded-full" />
                {item}
                <span className="w-1 h-1 bg-gold rounded-full" />
              </span>
            ))
          )}
        </div>
      </div>

      {/* FILTER + PRODUCTS */}
      <section id="products-section">
        <div className="py-[60px] px-4 sm:px-8 md:px-12 text-center">
          <div className="text-gold text-[11px] tracking-[4px] uppercase mb-3">✦ Curated Selection</div>
          <h2 className="font-cormorant text-text-dark font-light text-[clamp(36px,5vw,56px)] mb-10">The Collection</h2>
          <div className="flex gap-2 justify-center flex-wrap overflow-x-auto pb-2 px-4 sm:px-0">
            {[
              { cat: 'all', label: 'All Bags' },
              { cat: 'tote', label: 'Totes' },
              { cat: 'crossbody', label: 'Crossbody' },
              { cat: 'clutch', label: 'Clutch' },
              { cat: 'backpack', label: 'Backpacks' },
              { cat: 'satchel', label: 'Satchels' },
              { cat: 'shoulder', label: 'Shoulder' },
              { cat: 'mini', label: 'Mini Bags' },
            ].map(({ cat, label }) => (
              <button
                key={cat}
                onClick={(e) => filterProducts(cat, e.currentTarget)}
                className={`filter-tab px-4 sm:px-6 py-2.5 border border-black/15 bg-transparent rounded-3xl text-[11px] sm:text-[13px] tracking-widest uppercase cursor-pointer transition-all duration-300 font-sans whitespace-nowrap ${activeFilter === cat ? 'bg-black border-black text-gold' : 'text-text-mid hover:bg-black hover:border-black hover:text-gold'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 sm:px-8 pb-20">
          {loadingProducts ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-sm overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-warm-gray" />
                  <div className="p-5">
                    <div className="h-3 bg-warm-gray rounded w-1/3 mb-3" />
                    <div className="h-5 bg-warm-gray rounded w-2/3 mb-3" />
                    <div className="h-4 bg-warm-gray rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : toShow.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {toShow.map((p) => (
                <div
                  key={p.id}
                  onClick={() => openLightbox(p)}
                  className="bg-white rounded-sm overflow-hidden cursor-pointer transition-transform duration-400 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
                >
                  <div className="relative overflow-hidden aspect-[3/4] bg-warm-gray group">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop`
                      }}
                    />
                    {p.badge && (
                      <span className="absolute top-4 left-4 bg-gold text-black text-[10px] tracking-widest uppercase py-1 px-2.5 font-medium">
                        {p.badge}
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                      <button
                        onClick={(e) => { e.stopPropagation(); quickWA(p.name, p.price) }}
                        className="flex-1 py-2.5 border border-white/40 bg-white/10 text-white text-[11px] tracking-widest uppercase backdrop-blur-[8px] hover:bg-gold hover:border-gold hover:text-black transition-all duration-300 cursor-pointer"
                      >
                        WhatsApp
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); openLightbox(p) }}
                        className="flex-1 py-2.5 border border-white/40 bg-white/10 text-white text-[11px] tracking-widest uppercase backdrop-blur-[8px] hover:bg-gold hover:border-gold hover:text-black transition-all duration-300 cursor-pointer"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-gold text-[10px] tracking-[2px] uppercase mb-1.5">{p.cat}</div>
                    <div className="font-cormorant text-text-dark text-xl font-normal mb-2">{p.name}</div>
                    <div className="text-text-dark text-[15px] font-medium">
                      {p.price}
                      {p.oldPrice && <span className="text-mid-gray text-xs line-through ml-2 font-light">{p.oldPrice}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-text-mid text-lg">No products found</p>
            </div>
          )}
          {toShow.length > 0 && !loadingProducts && (
            <div className="text-center py-10">
              <button
                onClick={loadMore}
                className="px-12 py-4 border border-black bg-transparent text-[12px] tracking-[2px] uppercase cursor-pointer hover:bg-black hover:text-gold transition-all duration-300"
              >
                Load More Products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-black py-16 sm:py-20 px-4 sm:px-8 md:px-12 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 sm:gap-12">
        {[
          { icon: '✦', title: 'Premium Quality', desc: 'Every bag is crafted from the finest materials, built to last a lifetime.' },
          { icon: '⟳', title: 'Easy Returns', desc: '30-day hassle-free return policy on all products.' },
          { icon: '◈', title: 'Worldwide Shipping', desc: 'Fast and secure delivery to your doorstep, anywhere in the world.' },
          { icon: '◉', title: 'Authentic Guarantee', desc: '100% authentic products, certified and quality-checked.' },
        ].map((f, i) => (
          <div key={i} className="text-center">
            <span className="text-3xl block mb-4">{f.icon}</span>
            <h3 className="font-cormorant text-gold-light text-2xl mb-2">{f.title}</h3>
            <p className="text-white/50 text-[13px] leading-[1.8]">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="bg-black pt-[60px] pb-8 px-4 sm:px-8 md:px-12">
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-8 sm:gap-12 mb-12 max-md:grid-cols-1">
          <div className="footer-brand">
            <div className="font-cormorant text-gold text-4xl tracking-[8px] font-light mb-4">KDJ</div>
            <p className="text-white/40 text-[13px] leading-[1.8] max-w-[280px]">
              Premium bags for every occasion. We believe that a great bag is more than just an accessory — it's a statement of who you are.
            </p>
          </div>
          <div className="footer-section">
            <h4 className="text-[11px] tracking-[2px] uppercase text-gold mb-5">Collections</h4>
            {['tote', 'crossbody', 'clutch', 'backpack', 'satchel'].map((cat) => (
              <button
                key={cat}
                onClick={() => filterProducts(cat)}
                className="block text-white/40 text-[13px] mb-2.5 hover:text-gold-light transition-colors cursor-pointer bg-transparent border-none text-left"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)} Bags
              </button>
            ))}
          </div>
          <div className="footer-section">
            <h4 className="text-[11px] tracking-[2px] uppercase text-gold mb-5">Contact</h4>
            <button onClick={() => setWaOpen(true)} className="block text-white/40 text-[13px] mb-2.5 hover:text-gold-light transition-colors cursor-pointer bg-transparent border-none text-left">WhatsApp Us</button>
            <span className="block text-white/40 text-[13px] mb-2.5">info@kdjbags.com</span>
            <span className="block text-white/40 text-[13px]">+234 800 KDJ BAGS</span>
          </div>
        </div>
        <div className="border-t border-white/8 pt-6 flex justify-between items-center max-md:flex-col gap-4">
          <p className="text-white/25 text-xs">© 2025 KDJ Premium Bags. All rights reserved.</p>
          <div className="flex gap-4">
            {['ig', 'fb', 'tw'].map((s) => (
              <button key={s} className="w-9 h-9 border border-white/12 rounded-full flex items-center justify-center text-white/40 text-sm hover:border-gold hover:text-gold transition-all cursor-pointer bg-transparent">
                {s}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* WHATSAPP WIDGET */}
      <div className="fixed bottom-[20px] sm:bottom-[30px] right-[20px] sm:right-[30px] z-[200]">
        <div className={`absolute bottom-[72px] right-0 w-[calc(100vw-40px)] sm:w-[340px] max-w-[340px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden animate-slideUp ${waOpen ? 'block' : 'hidden'}`}>
          <div className="bg-[#075E54] p-5 flex items-center gap-3">
            <div className="w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center text-xl">👜</div>
            <div>
              <h4 className="text-white text-[15px] font-medium">KDJ Bags Support</h4>
              <div className="flex items-center gap-1 text-white/60 text-xs">
                <span className="w-2 h-2 bg-[#25D366] rounded-full" />
                <span>Online now</span>
              </div>
            </div>
          </div>
          <div className="p-5 bg-[#ECE5DD]">
            <div className="bg-white rounded-xl rounded-bl-none p-3 text-sm leading-[1.5] text-text-dark mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.1)] max-w-[90%]">
              👋 Hello! Welcome to <strong>KDJ Bags</strong>.<br /><br />
              How can we help you today? You can also send us an image of a bag you're looking for!
            </div>
            <div className="flex flex-col gap-2">
              {waOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => waOption(opt.label)}
                  className="bg-white border border-[#25D366] rounded-lg p-2.5 text-[13px] text-[#075E54] text-left hover:bg-[#dcf8c6] transition-all cursor-pointer"
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-[#f0f0f0]">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={waInput}
                onChange={(e) => setWaInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendWA()}
                placeholder="Type a message..."
                className="flex-1 px-3.5 py-2.5 border border-[#e0e0e0] rounded-3xl text-[13px] outline-none font-sans"
              />
              <button onClick={sendWA} className="w-10 h-10 bg-[#25D366] border-none rounded-full cursor-pointer flex items-center justify-center hover:bg-[#128C7E] transition-all">
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </div>
            <div className="mt-2 text-center text-[11px] text-mid-gray">
              📎 <label className="text-[#075E54] cursor-pointer underline">Send a bag image you're looking for</label>
              <input type="file" accept="image/*" className="hidden" onChange={handleWAImage} />
            </div>
          </div>
        </div>
        <button
          onClick={() => setWaOpen(!waOpen)}
          className="w-[60px] h-[60px] bg-[#25D366] rounded-full flex items-center justify-center cursor-pointer shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_12px_32px_rgba(37,211,102,0.5)] transition-all relative border-none"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
          <span className={`absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-badgePulse ${waOpen ? 'hidden' : 'flex'}`}>1</span>
        </button>
      </div>

      {/* ADMIN MODAL */}
      {adminOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-[8px] flex items-center justify-center cursor-pointer p-4"
          onClick={(e) => e.target === e.currentTarget && closeAdmin()}
        >
          <div className="bg-white w-full max-w-[960px] max-h-[90vh] overflow-y-auto rounded animate-modalIn cursor-default">
            {!adminLoggedIn ? (
              <div className="p-12 max-w-md mx-auto">
                <div className="font-cormorant text-gold text-3xl font-light tracking-widest text-center mb-8">KDJ Admin Login</div>
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="px-4 py-3 border border-[#e0e0e0] rounded text-sm outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="px-4 py-3 border border-[#e0e0e0] rounded text-sm outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
                  <button type="submit" className="mt-4 px-6 py-3 bg-black text-gold border-none text-[12px] tracking-widest uppercase cursor-pointer hover:bg-gold-dark hover:text-white transition-all">
                    Login
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="bg-black px-8 py-6 flex items-center justify-between">
                  <h2 className="font-cormorant text-gold text-[28px] font-light tracking-[4px]">KDJ Admin Panel</h2>
                  <button onClick={closeAdmin} className="bg-transparent border border-white/20 text-white w-9 h-9 rounded-full cursor-pointer text-lg flex items-center justify-center hover:bg-white/10 transition-all">✕</button>
                </div>
                <div className="flex border-b border-[#e8e8e8]">
                  {['add', 'manage', 'settings'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAdminTab(tab)}
                      className={`px-7 py-4 border-none bg-transparent text-[13px] tracking-widest uppercase cursor-pointer transition-all font-sans ${adminTab === tab
                        ? 'text-gold-dark border-b-2 border-gold'
                        : 'text-text-mid border-b-2 border-transparent'
                        }`}
                    >
                      {tab === 'add' ? 'Add Product' : tab === 'manage' ? 'Manage Products' : 'Settings'}
                    </button>
                  ))}
                </div>

                {adminTab === 'add' && (
                  <div className="p-8">
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Product Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Milano Leather Tote"
                          className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Category</label>
                        <select
                          value={formData.cat}
                          onChange={(e) => setFormData({ ...formData, cat: e.target.value })}
                          className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors"
                        >
                          {['tote', 'crossbody', 'clutch', 'backpack', 'satchel', 'shoulder', 'mini'].map((c) => (
                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Price (₦)</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="e.g. 45000"
                          className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Old Price (₦) – optional</label>
                        <input
                          type="number"
                          value={formData.oldPrice}
                          onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                          placeholder="e.g. 60000"
                          className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors"
                        />
                      </div>
                    </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Image URL (from Unsplash or any URL)</label>
                        <input
                          type="text"
                          value={formData.imgUrl}
                          onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Or Upload Image</label>
                        <input type="file" accept="image/*" onChange={previewAdminImg} className="text-sm" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Badge (optional)</label>
                          <select
                            value={formData.badge}
                            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                            className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors"
                          >
                            {['None', 'New', 'Sale', 'Hot', 'Limited'].map((b) => (
                              <option key={b} value={b === 'None' ? '' : b}>{b}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Description (optional)</label>
                          <textarea
                            value={formData.desc}
                            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                            placeholder="Brief description..."
                            className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors resize-vertical min-h-[80px]"
                          />
                        </div>
                      </div>
                      <button
                        onClick={addProduct}
                        className="self-start px-8 py-3.5 bg-black text-gold border-none text-[12px] tracking-widest uppercase cursor-pointer hover:bg-gold-dark hover:text-white transition-all"
                      >
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
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="w-full mt-2 py-2 bg-[#fee] border border-[#fcc] text-[#c00] text-[12px] cursor-pointer hover:bg-[#fcc] transition-all"
                            >
                              Delete Product
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminTab === 'settings' && (
                  <div className="p-4 sm:p-8">
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">WhatsApp Phone Number</label>
                        <input
                          type="text"
                          value={settingsForm.phone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                          placeholder="+234..."
                          className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">Store Name</label>
                        <input
                          type="text"
                          value={settingsForm.name}
                          onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                          className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] tracking-widest uppercase text-text-mid font-medium">WhatsApp Greeting Message</label>
                        <textarea
                          value={settingsForm.greeting}
                          onChange={(e) => setSettingsForm({ ...settingsForm, greeting: e.target.value })}
                          className="px-4 py-3 border border-[#e0e0e0] rounded-sm text-sm outline-none focus:border-gold transition-colors resize-vertical min-h-[80px]"
                        />
                      </div>
                      <button
                        onClick={saveSettings}
                        className="self-start px-8 py-3.5 bg-black text-gold border-none text-[12px] tracking-widest uppercase cursor-pointer hover:bg-gold-dark hover:text-white transition-all"
                      >
                        Save Settings
                      </button>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#e8e8e8]">
                        <span className="text-[11px] tracking-widest uppercase text-text-mid font-medium">API Backend:</span>
                        <button
                          onClick={() => setUseApi2(!useApi2)}
                          className={`px-4 py-2 text-[11px] tracking-widest uppercase border cursor-pointer transition-all ${useApi2 ? 'bg-gold border-gold-dark text-black' : 'bg-transparent border-[#e0e0e0] text-text-mid hover:border-gold'}`}
                        >
                          {useApi2 ? 'Backend 2 (Vercel)' : 'Backend 1 (Local)'}
                        </button>
                        <span className={`w-2 h-2 rounded-full ${apiStatus === 'fallback' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                        <span className="text-[11px] text-text-mid">{apiStatus === 'fallback' ? 'Using fallback' : 'Primary active'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxProduct && (
        <div
          className="fixed inset-0 z-[500] bg-black/95 cursor-pointer flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 sm:top-6 sm:right-8 text-white text-3xl opacity-70 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer z-10">✕</button>
          <img
            src={lightboxProduct.img}
            alt={lightboxProduct.name}
            className="max-w-[95vw] sm:max-w-[80vw] max-h-[70vh] sm:max-h-[85vh] object-contain rounded-sm animate-modalIn"
          />
          <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 text-center text-white w-full px-4">
            <h3 className="font-cormorant text-xl sm:text-2xl font-light tracking-widest">{lightboxProduct.name}</h3>
            <p className="text-white/60 text-[13px] mt-1">{lightboxProduct.price}</p>
            <button onClick={enquireOnWA} className="mt-3 sm:mt-4 px-5 sm:px-7 py-2.5 sm:py-3 bg-[#25D366] text-white border-none rounded-full text-[13px] tracking-wider inline-flex items-center gap-2 cursor-pointer">
              💬 Enquire on WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div className={`fixed bottom-[100px] left-1/2 -translate-x-1/2 translate-y-5 bg-black text-gold px-6 py-3 rounded-full text-[13px] tracking-wider opacity-0 pointer-events-none transition-all duration-400 z-[1000] border border-gold/30 ${toast ? 'opacity-100 translate-y-0' : ''}`}>
        {toast}
      </div>
    </div>
  )
}

export default App
