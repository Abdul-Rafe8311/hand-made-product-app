-- Seed the six handmade products.
-- Prices are stored in the smallest currency unit (cents), so $24 is 2400.
-- Safe to run more than once: it upserts on the unique slug.

insert into public.products
  (slug, name, tagline, description, price, lot, sku, materials, dimensions, image_url, active)
values
  (
    'soy-candle',
    'Hand-poured Soy Candle',
    'Slow-burning, lightly scented',
    'Poured by hand in small batches from natural soy wax with a cotton wick and a soft scent, burns clean for around forty hours.',
    2400,
    '01',
    'MTC-014',
    array['Soy wax', 'Cotton wick', 'Cedar and amber oil'],
    '8 cm x 8 cm',
    null,
    true
  ),
  (
    'stoneware-mug',
    'Stoneware Mug',
    'Thrown to sit right in the hand',
    'Wheel-thrown stoneware, glazed and fired in the studio, handle shaped to hold comfortably, each varies a little in tone.',
    3200,
    '02',
    'MTC-021',
    array['Stoneware clay', 'Food-safe glaze'],
    '300 ml',
    null,
    true
  ),
  (
    'wooden-bowl',
    'Carved Wooden Bowl',
    'Turned from a single block',
    'Hand-turned from a single piece of seasoned wood, finished with food-safe oil, grain left to show.',
    4400,
    '03',
    'MTC-033',
    array['Seasoned beech', 'Natural oil finish'],
    '18 cm across',
    null,
    true
  ),
  (
    'stoneware-planter',
    'Glazed Stoneware Planter',
    'For a plant you love',
    'A small glazed planter thrown on the wheel with a drainage hole and a matching dish, glaze breaks differently in each firing.',
    3800,
    '04',
    'MTC-042',
    array['Stoneware clay', 'Reactive glaze'],
    '12 cm tall',
    null,
    true
  ),
  (
    'wool-scarf',
    'Handwoven Wool Scarf',
    'Warm, light, and yours',
    'Woven by hand on a floor loom from soft lambswool, light for spring and warm for winter.',
    4600,
    '05',
    'MTC-058',
    array['Lambswool'],
    '180 cm x 30 cm',
    null,
    true
  ),
  (
    'tote-bag',
    'Block-printed Tote Bag',
    'Printed one bag at a time',
    'Heavy cotton canvas, block-printed by hand with a carved wooden stamp, roomy for a market run.',
    3500,
    '06',
    'MTC-061',
    array['Cotton canvas', 'Water-based ink'],
    '38 cm x 40 cm',
    null,
    true
  )
on conflict (slug) do update set
  name        = excluded.name,
  tagline     = excluded.tagline,
  description = excluded.description,
  price       = excluded.price,
  lot         = excluded.lot,
  sku         = excluded.sku,
  materials   = excluded.materials,
  dimensions  = excluded.dimensions,
  active      = excluded.active;
