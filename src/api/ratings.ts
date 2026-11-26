// Ratings go through the rate_recipe RPC; the ratings table itself is closed to the public key.
import { supabase } from '@/lib/supabase'

export async function rateRecipe(recipeId: string, deviceId: string, score: number): Promise<void> {
  const { error } = await supabase.rpc('rate_recipe', {
    p_recipe_id: recipeId,
    p_device_id: deviceId,
    p_score: score,
  })
  if (error) throw new Error(error.message)
}
