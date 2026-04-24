import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

const uploadsDir = join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const dataFile = join(__dirname, 'data.json')

const loadData = () => {
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  }
  return { products: [], settings: { phone: '+2349039917087', name: 'KDJ Premium Bags', greeting: "Hello! I'm interested in your bags collection." } }
}

const saveData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
}

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop()
    cb(null, `${uuidv4()}.${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

app.get('/api/products', (req, res) => {
  try {
    const data = loadData()
    res.json(data.products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/products', upload.single('image'), (req, res) => {
  try {
    const { name, cat, price, oldPrice, badge } = req.body
    
    if (!name || !cat || !price) {
      return res.status(400).json({ error: 'Name, category, and price are required' })
    }

    let img = ''
    let imgType = 'url'

    if (req.file) {
      img = `/uploads/${req.file.filename}`
      imgType = 'file'
    } else if (req.body.img) {
      img = req.body.img
      imgType = 'url'
    }

    const data = loadData()
    const newProduct = {
      id: Date.now(),
      name,
      cat,
      price,
      oldPrice: oldPrice || '',
      badge: badge || '',
      img,
      imgType,
      createdAt: new Date().toISOString()
    }
    
    data.products.unshift(newProduct)
    saveData(data)
    
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params
    const data = loadData()
    const productIndex = data.products.findIndex(p => p.id === parseInt(id))
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const product = data.products[productIndex]

    if (product.imgType === 'file' && product.img) {
      const filePath = join(__dirname, product.img)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    data.products.splice(productIndex, 1)
    saveData(data)
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/settings', (req, res) => {
  try {
    const data = loadData()
    res.json(data.settings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/settings', (req, res) => {
  try {
    const { phone, name, greeting } = req.body
    const data = loadData()
    data.settings = { phone, name, greeting }
    saveData(data)
    res.json({ message: 'Settings saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})