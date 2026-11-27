// Entry point. Providers wrap the app in this order: Favorites > Recipes > Shopping list > router.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { RecipesProvider } from '@/context/RecipesContext'
import { ShoppingListProvider } from '@/context/ShoppingListContext'
import { App } from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavoritesProvider>
      <RecipesProvider>
        <ShoppingListProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ShoppingListProvider>
      </RecipesProvider>
    </FavoritesProvider>
  </StrictMode>,
)
