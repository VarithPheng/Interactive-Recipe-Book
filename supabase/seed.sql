-- Six protected starter recipes (can_delete = false). Run after 001_init.sql in the SQL editor.
-- Photos: upload these files to the R2 bucket under seed/ (see README).
-- ingredient_names is derived from ingredients so the two always match.

insert into public.recipes
  (title, description, category, ingredients, ingredient_names, steps,
   prep_minutes, servings, photo_url, can_delete, is_featured, created_at)
select title, description, category, ingredients,
       array(select lower(trim(e->>'name')) from jsonb_array_elements(ingredients) e),
       steps, prep_minutes, servings, photo_url, false, is_featured, created_at
from (values
  (
    'Buttermilk Pancakes',
    'Thick, soft pancakes for a slow weekend breakfast.',
    'Breakfast',
    '[{"name":"Flour","qty":250,"unit":"g"},
      {"name":"Buttermilk","qty":400,"unit":"ml"},
      {"name":"Egg","qty":2,"unit":"piece"},
      {"name":"Sugar","qty":2,"unit":"tbsp"},
      {"name":"Baking powder","qty":2,"unit":"tsp"},
      {"name":"Butter","qty":30,"unit":"g"},
      {"name":"Salt","qty":1,"unit":"pinch"}]'::jsonb,
    array[
      'Whisk the flour, sugar, baking powder and salt in a large bowl.',
      'Melt the butter. In another bowl, beat the eggs into the buttermilk, then stir in the butter.',
      'Pour the wet mixture into the dry and stir until just combined. Small lumps are fine.',
      'Heat a lightly oiled pan over medium heat and pour in about 60 ml of batter per pancake.',
      'Flip when bubbles form on top, then cook 1 more minute. Serve warm.'
    ],
    25, 4,
    'https://pub-f4fffd1498064d939fb60be8180066a2.r2.dev/seed/buttermilk-pancakes.webp',
    true, now() - interval '6 days'
  ),
  (
    'Lemon Herb Roast Chicken',
    'A whole chicken roasted over potatoes with lemon, garlic and thyme.',
    'Main',
    '[{"name":"Whole chicken","qty":1.6,"unit":"kg"},
      {"name":"Potatoes","qty":800,"unit":"g"},
      {"name":"Lemon","qty":1,"unit":"piece"},
      {"name":"Garlic","qty":6,"unit":"piece"},
      {"name":"Fresh thyme","qty":2,"unit":"tbsp"},
      {"name":"Olive oil","qty":3,"unit":"tbsp"},
      {"name":"Salt","qty":2,"unit":"tsp"}]'::jsonb,
    array[
      'Heat the oven to 200 °C. Pat the chicken dry and season it all over with salt.',
      'Cut the potatoes into chunks, toss with 2 tbsp olive oil and spread them in a roasting tin.',
      'Halve the lemon and put it inside the chicken with the garlic and half the thyme.',
      'Set the chicken on the potatoes, rub with the remaining oil and thyme, and roast for 75 minutes.',
      'Rest for 10 minutes before carving. Spoon the pan juices over the potatoes.'
    ],
    95, 4,
    'https://pub-f4fffd1498064d939fb60be8180066a2.r2.dev/seed/lemon-herb-roast-chicken.webp',
    false, now() - interval '5 days'
  ),
  (
    'Tomato Basil Soup',
    'A smooth soup made with canned tomatoes and fresh basil.',
    'Soup',
    '[{"name":"Canned tomatoes","qty":800,"unit":"g"},
      {"name":"Onion","qty":1,"unit":"piece"},
      {"name":"Garlic","qty":3,"unit":"piece"},
      {"name":"Vegetable stock","qty":500,"unit":"ml"},
      {"name":"Fresh basil","qty":1,"unit":"cup"},
      {"name":"Olive oil","qty":2,"unit":"tbsp"},
      {"name":"Cream","qty":60,"unit":"ml"}]'::jsonb,
    array[
      'Chop the onion and garlic and soften them in the olive oil for 8 minutes.',
      'Add the tomatoes and stock, bring to a boil, then simmer for 20 minutes.',
      'Add most of the basil and blend until smooth.',
      'Stir in the cream, season to taste and serve with the remaining basil on top.'
    ],
    40, 4,
    'https://pub-f4fffd1498064d939fb60be8180066a2.r2.dev/seed/tomato-basil-soup.webp',
    true, now() - interval '4 days'
  ),
  (
    'Greek Salad',
    'Tomatoes, cucumber, olives and feta with a simple oregano dressing.',
    'Salad',
    '[{"name":"Tomatoes","qty":4,"unit":"piece"},
      {"name":"Cucumber","qty":1,"unit":"piece"},
      {"name":"Red onion","qty":0.5,"unit":"piece"},
      {"name":"Kalamata olives","qty":80,"unit":"g"},
      {"name":"Feta","qty":200,"unit":"g"},
      {"name":"Olive oil","qty":3,"unit":"tbsp"},
      {"name":"Dried oregano","qty":1,"unit":"tsp"}]'::jsonb,
    array[
      'Cut the tomatoes into wedges and the cucumber into thick half-moons.',
      'Slice the red onion thinly and add it to a bowl with the tomatoes, cucumber and olives.',
      'Drizzle with olive oil and toss gently.',
      'Lay the feta on top in one piece and sprinkle with oregano.'
    ],
    15, 2,
    'https://pub-f4fffd1498064d939fb60be8180066a2.r2.dev/seed/greek-salad.webp',
    false, now() - interval '3 days'
  ),
  (
    'Chocolate Chip Cookies',
    'Crisp at the edges and chewy in the middle.',
    'Dessert',
    '[{"name":"Butter","qty":115,"unit":"g"},
      {"name":"Brown sugar","qty":150,"unit":"g"},
      {"name":"Egg","qty":1,"unit":"piece"},
      {"name":"Flour","qty":190,"unit":"g"},
      {"name":"Baking soda","qty":0.5,"unit":"tsp"},
      {"name":"Chocolate chips","qty":170,"unit":"g"},
      {"name":"Salt","qty":1,"unit":"pinch"}]'::jsonb,
    array[
      'Heat the oven to 180 °C and line a tray with baking paper.',
      'Beat the soft butter and brown sugar until creamy, then beat in the egg.',
      'Stir in the flour, baking soda and salt, then fold in the chocolate chips.',
      'Roll into 12 balls and space them out on the tray.',
      'Bake for 10 to 12 minutes, until golden at the edges. Cool on the tray for 5 minutes.'
    ],
    30, 12,
    'https://pub-f4fffd1498064d939fb60be8180066a2.r2.dev/seed/chocolate-chip-cookies.webp',
    true, now() - interval '2 days'
  ),
  (
    'Classic Hummus',
    'Creamy chickpea dip with tahini and lemon.',
    'Snack',
    '[{"name":"Chickpeas","qty":400,"unit":"g"},
      {"name":"Tahini","qty":4,"unit":"tbsp"},
      {"name":"Lemon","qty":1,"unit":"piece"},
      {"name":"Garlic","qty":1,"unit":"piece"},
      {"name":"Olive oil","qty":2,"unit":"tbsp"},
      {"name":"Ground cumin","qty":0.5,"unit":"tsp"},
      {"name":"Salt","qty":1,"unit":"pinch"}]'::jsonb,
    array[
      'Drain the chickpeas, keeping a little of the liquid.',
      'Blend the tahini and lemon juice for 1 minute until pale.',
      'Add the chickpeas, garlic, cumin and salt and blend until smooth.',
      'Loosen with a few spoons of the chickpea liquid until creamy.',
      'Spread in a bowl and finish with olive oil.'
    ],
    10, 6,
    'https://pub-f4fffd1498064d939fb60be8180066a2.r2.dev/seed/classic-hummus.webp',
    false, now() - interval '1 day'
  )
) as v(title, description, category, ingredients, steps, prep_minutes, servings,
       photo_url, is_featured, created_at);
