# Product photos

Drop one photo per product into this folder, named after the product **slug**,
then run `npm run upload:photos`. The script uploads each file to the public
`products` Supabase Storage bucket and writes the public URL onto the matching
product, so the real photo shows on the shop and product pages instead of the
placeholder art.

- Accepted extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`
- File name must equal the slug, e.g. `something-blue-bouquet.jpg`
- Re-running overwrites the photo and refreshes the URL (safe to repeat)
- The actual image files are git-ignored (only this manifest is tracked)

## Slugs to fill (matched to the photos you sent)

### Crochet Bouquets
- `something-blue-bouquet` — blue and ivory crochet roses with dried baby's breath, peach bow
- `single-sunflower-stem` — one crochet sunflower wrapped in burlap and jute
- `rustic-sunflower-posy` — sunflowers, small white blooms and a pink daisy in burlap
- `red-rose-bouquet` — red crochet roses with gold sprigs and a birthday card
- `forget-me-not-bouquet` — blue forget-me-nots and white tulips, pale blue wrap
- `single-red-rose` — a single red crochet rose in striped paper with jute
- `monochrome-tulip-bouquet` — black and white crochet tulips in burlap
- `garden-medley-bouquet` — large round bouquet, big sunflower centre ringed by roses
- `peach-rose-daisy-bouquet` — peach roses and daisies with teal leaves, kraft wrap
- `rainbow-bear-bouquet` — fluffy pastel chenille bear on a stem, blue wrap
- `blush-rose-bouquet` — pink and cream roses with a little white bunny, white wrap

### Crochet
- `pouty-cat-keychain` — white pouty cat keychain with blush cheeks
- `blueberry-buddy-keychain` — navy blueberry character keychain with green leaf
- `happy-cloud-keychain` — blue smiling cloud keychain with beaded charm
- `watermelon-slice-keychain` — watermelon slice keychain with fruit confetti
- `strawberry-keychain` — red strawberry keychain with green leafy top
- `beaded-bow-keychain` — chunky crochet bow keychain with beads (pink shown)
- `flower-keychain` — five-petal crochet flower keychain with beaded centre
- `bumblebee-plushie` — round yellow and black bee plush with pink bow
- `jute-coaster-set` — pair of round jute coasters with red trim
- `hand-crochet-scarf` — long navy crochet scarf
- `flower-hair-pins` — crochet flower bobby pins (yellow / navy / white)
- `embroidered-snap-clips` — crochet snap clips embroidered with flowers
- `little-sheep-clip` — white sheep with black face crochet clip (Eid)
- `crochet-coin-purse` — small round yellow crochet coin purse
- `potted-crochet-flower` — small peach crochet flower in a green pot

### Candles
- `honeycomb-heart-candle` — heart candle with honeycomb texture (teal shown)
- `bubble-cube-candle` — cube candle made of bubbles (colourful trio)
- `heart-cube-candle` — cube candle made of little hearts (white shown)
- `snowflake-candle` — white snowflake-shaped candle
- `mini-jar-candle` — small candle in a glass milk jar with pink ribbon
- `seashell-candle` — scalloped seashell candle in peach-to-lilac ombre
- `daisy-flower-candle` — pink daisy flower candle
- `rose-peony-candle` — rounded peony candle (dusty blue)
- `coral-cluster-candle` — pink coral-cluster textured candle
- `stacked-hearts-candle` — tall stacked-hearts pillar candle with red dots

### Wooden Decor
- `painted-honey-pot` — wooden honey pot with dipper, painted village scene
- `painted-bird-pair` — two hand-painted floral birds
- `painted-elephant-pair` — two hand-painted elephants (blue and floral)
- `naqshi-stacked-pots` — red and black naqshi painted stacked pots
- `mushroom-trinket-dish` — small painted trinket dish with a toadstool and gold rim
- `calligraphy-storage-jar` — cobalt blue lidded jar with white calligraphy

### Gift Baskets
- `soft-girl-beauty-crate` — wooden crate with cat plush, perfume and makeup, pink bows
- `with-love-gift-box` — GA box with crochet keychains and candles, handwritten note
- `favourite-person-memory-box` — red box with photo collage, bangles and a lantern
- `chocolate-lovers-hamper` — basket of chocolates with red ribbons
- `eid-mubarak-hamper` — cellophane and organza hampers with red bows, Eid tag
- `mehndi-festivity-basket` — golden tray basket with bangles, chocolates, crochet sunflower
- `birthday-snack-hamper` — basket of snacks and chocolates with balloons and a rose bunch
