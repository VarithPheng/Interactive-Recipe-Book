// Entry point. Providers wrap the app in this order: Favorites > Recipes > router.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { RecipesProvider } from '@/context/RecipesContext'
import { App } from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavoritesProvider>
      <RecipesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RecipesProvider>
    </FavoritesProvider>
  </StrictMode>,
)
