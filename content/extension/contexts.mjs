// Original situations authored for the extension. Four distinct tasks use each
// context; no question is copied from a publisher or padded by option shuffling.
const rows = (text) =>
  text
    .trim()
    .split("\n")
    .map((line) => line.split("|"));
export const existence = rows(`
is|a clock|above the reception desk
are|two ramps|beside the front steps
is|a first-aid kit|inside the cupboard
are|three lanterns|along the garden path
is|some drinking water|in the cooler
are|several benches|under the oak tree
is|a noticeboard|outside the staff room
are|four lockers|near the changing room
is|some sand|inside the bucket
is|a charging point|next to the window
are|six towels|on the bathroom shelf
is|a recycling bin|behind the building
are|two maps|beside the ticket machine
is|some flour|in the blue container
is|a piano|at the back of the hall
are|five ducklings|beside the pond
is|a footbridge|over the stream
are|some cushions|on the sofa
is|some soap|beside the sink
is|a lift|near the main staircase
are|three paintings|in the waiting area
is|a parcel|under the porch
are|two exits|at the end of the corridor
is|some luggage|beside the tour bus
is|a basket|under the workbench
are|several sockets|above the kitchen counter
is|a bicycle rack|outside the sports centre
are|four candles|on the mantelpiece
is|some ice|in the freezer tray
is|a handrail|along the narrow steps
are|two microphones|on the stage
is|a fountain|in the courtyard
are|some apples|inside the picnic bag
is|some honey|in the small jar
is|a greenhouse|behind the cottage
are|three helmets|in the equipment room
is|a thermometer|beside the medicine box
are|two ferries|near the harbour entrance
is|some furniture|in the storage unit
is|a calendar|above the printer
are|several umbrellas|in the stand
is|a cash machine|opposite the pharmacy
are|four stools|beside the breakfast bar
is|some rice|in the saucepan
is|a path|through the orchard
are|two nests|under the roof
is|a blanket|inside the emergency bag
are|five envelopes|in the top drawer
is|some petrol|in the spare can
is|a sign|beside the cycle lane
`);
export const possession = rows(`
I|have|I|a reusable lunch box
you|have|you|a spare house key
she|has|she|a waterproof backpack
he|has|he|a library membership
we|have|we|a small vegetable plot
they|have|they|a season ticket
the apartment|has|it|a balcony facing the river
our classroom|has|it|an interactive whiteboard
my grandparents|have|they|a collection of old postcards
the hotel|has|it|a rooftop terrace
I|have|I|a dentist appointment on Friday
you|have|you|a useful suggestion
she|has|she|a younger brother
he|has|he|curly black hair
we|have|we|enough paint for the fence
they|have|they|a large extended family
the cottage|has|it|a fireplace in the sitting room
our school|has|it|an indoor swimming pool
my neighbours|have|they|two rescue cats
the campsite|has|it|a shared kitchen
I|have|I|a sore throat today
you|have|you|an interview next Tuesday
she|has|she|a talent for languages
he|has|he|a striped wool scarf
we|have|we|a clear view of the mountains
they|have|they|enough chairs for the guests
the museum|has|it|a room for school groups
our town|has|it|an annual food festival
my cousins|have|they|a new puppy
the bus|has|it|space for a wheelchair
I|have|I|a recipe for pumpkin soup
you|have|you|a discount voucher
she|has|she|a meeting after lunch
he|has|he|a bright yellow raincoat
we|have|we|a reliable internet connection
they|have|they|a long journey ahead
the restaurant|has|it|a separate children's menu
our garden|has|it|a wooden tool shed
my parents|have|they|tickets for the orchestra
the camera|has|it|a rechargeable battery
I|have|I|a pocket dictionary
you|have|you|a choice of three routes
she|has|she|a qualification in engineering
he|has|he|a cold this week
we|have|we|a reservation for tonight
they|have|they|plans for the weekend
the village|has|it|a volunteer fire service
our team|has|it|a match on Saturday
my friends|have|they|a tent for four people
the suitcase|has|it|a broken handle
`);
// Countability is pinned to the named sense; drinks, materials and foods can
// acquire countable senses in other contexts.
export const quantities = rows(`
C|stamps|the stamp album|collecting postage stamps
C|batteries|the repair kit|replacing torch batteries
C|screws|the hardware box|assembling a bookcase
C|folders|the office cupboard|organising paper records
C|tomatoes|the vegetable basket|making tomato salad
C|peaches|the fruit crate|packing fruit baskets
C|sandwiches|the lunch tray|preparing packed lunches
C|notebooks|the stationery shelf|equipping a classroom
C|spoons|the cutlery drawer|setting the tea table
C|cups|the kitchen rack|serving hot drinks
C|plates|the dining cupboard|laying out a buffet
C|bottles|the recycling container|sorting glass containers
C|chairs|the meeting room|seating the committee
C|tables|the exhibition hall|arranging display furniture
C|tickets|the booking envelope|organising a group visit
C|coins|the collection tin|counting a coin collection
C|brushes|the art cupboard|equipping an art lesson
C|seedlings|the growing tray|planting a vegetable bed
C|buttons|the sewing basket|mending shirts
C|blankets|the supply cupboard|equipping a shelter
C|pillows|the linen store|preparing guest rooms
C|envelopes|the mailing box|sending invitation letters
C|candles|the decoration box|setting up a celebration
C|gloves|the safety cupboard|preparing a gardening session
C|maps|the information stand|helping walking groups
U|water|the drinking tank|measuring drinking water
U|rice|the grain jar|weighing uncooked rice
U|flour|the baking container|measuring flour for bread
U|sugar|the ingredient tub|weighing granulated sugar
U|salt|the seasoning pot|measuring table salt
U|milk|the dairy jug|measuring milk for a recipe
U|honey|the glass jar|weighing honey
U|butter|the baking bowl|measuring butter by weight
U|bread|the bread basket|weighing bread rather than counting loaves
U|cheese|the picnic container|weighing cheese rather than counting varieties
U|money|the project fund|recording a sum of money
U|advice|the guidance document|seeking practical advice
U|information|the visitor leaflet|checking factual information
U|luggage|the storage area|weighing travellers' luggage
U|furniture|the storeroom|describing furniture collectively
U|equipment|the sports store|describing sports equipment collectively
U|homework|the assignment folder|discussing assigned homework
U|traffic|the road report|describing road traffic collectively
U|news|the bulletin|reporting recent news collectively
U|research|the project archive|discussing research as an activity
U|progress|the training record|describing progress in learning
U|space|the storage plan|measuring available storage space
U|time|the schedule|measuring time for an activity
U|fuel|the reserve tank|measuring liquid fuel
U|soap|the washing container|measuring liquid soap
`);
export const owners = rows(`
the baker|the baker's|one baker|the apron
the pilot|the pilot's|one pilot|the headset
the nurse|the nurse's|one nurse|the badge
the musician|the musician's|one musician|the case
the gardener|the gardener's|one gardener|the spade
the photographer|the photographer's|one photographer|the lens
the chef|the chef's|one chef|the recipe
the librarian|the librarian's|one librarian|the desk
the cyclist|the cyclist's|one cyclist|the helmet
the visitor|the visitor's|one visitor|the pass
the teacher|the teacher's|one teacher|the timetable
the driver|the driver's|one driver|the licence
the artist|the artist's|one artist|the sketchbook
the farmer|the farmer's|one farmer|the tractor
the swimmer|the swimmer's|one swimmer|the towel
the carpenter|the carpenter's|one carpenter|the saw
the actor|the actor's|one actor|the costume
the manager|the manager's|one manager|the laptop
the student|the student's|one student|the workbook
the engineer|the engineer's|one engineer|the drawing
the dog|the dog's|one dog|the collar
the cat|the cat's|one cat|the basket
the horse|the horse's|one horse|the saddle
the baby|the baby's|one baby|the blanket
the child|the child's|one child|the toy
the bakers|the bakers'|several bakers|the aprons
the pilots|the pilots'|several pilots|the headsets
the nurses|the nurses'|several nurses|the badges
the musicians|the musicians'|several musicians|the cases
the gardeners|the gardeners'|several gardeners|the spades
the photographers|the photographers'|several photographers|the lenses
the chefs|the chefs'|several chefs|the recipes
the librarians|the librarians'|several librarians|the desks
the cyclists|the cyclists'|several cyclists|the helmets
the visitors|the visitors'|several visitors|the passes
the teachers|the teachers'|several teachers|the timetables
the drivers|the drivers'|several drivers|the licences
the artists|the artists'|several artists|the sketchbooks
the farmers|the farmers'|several farmers|the tractors
the swimmers|the swimmers'|several swimmers|the towels
the carpenters|the carpenters'|several carpenters|the saws
the actors|the actors'|several actors|the costumes
the managers|the managers'|several managers|the laptops
the engineers|the engineers'|several engineers|the drawings
the students|the students'|several students|the workbooks
the children|the children's|several children|the toys
the women|the women's|several women|the coats
the men|the men's|several men|the boots
the people|the people's|several people|the opinions
the mice|the mice's|several mice|the nests
`);
export const places = rows(`
in|the sealed envelope|a cheque|inside the envelope, not attached to its surface
in|the zipped suitcase|a jumper|inside the suitcase, not on its lid
in|the locked drawer|a passport|inside the drawer, not resting on top
in|the glass aquarium|a fish|inside the aquarium, surrounded by water
in|the biscuit tin|a biscuit|inside the tin, not on its lid
in|the pencil case|an eraser|inside the case, not on the outside
in|the medicine cabinet|a bandage|inside the cabinet, not on its roof
in|the cardboard carton|a mug|inside the carton, not on the outside
in|the fridge|a melon|inside the fridge, not on top of it
in|the washing machine|a sock|inside the drum, not on top of the machine
in|the cave|a bat|inside the cave, surrounded by its walls
in|the tunnel|a maintenance cart|inside the tunnel, not on the ground above it
in|the tent|a sleeping bag|inside the tent, not on its roof
in|the greenhouse|a tomato plant|inside the greenhouse, protected by its walls
in|the swimming pool|a swimmer|inside the water, not beside the pool
in|the car|a passenger|inside the car, not on its roof
in|the valley|a farmhouse|within the valley, between the hills
in|the forest|a deer|within the forest, surrounded by trees
in|the city of Bristol|an office|within the city boundaries
in|Portugal|a vineyard|within the country's borders
on|the mantelpiece|a vase|resting on the upper surface
on|the kitchen counter|a chopping board|resting on the counter's surface
on|the roof|a weather vane|fixed to the roof's outside surface
on|the ceiling|a smoke alarm|attached to the ceiling's surface
on|the bedroom wall|a poster|attached flat against the wall's surface
on|the noticeboard|a timetable|pinned against the board's surface
on|the doorstep|a flowerpot|resting on the step's upper surface
on|the window ledge|a candle|resting on the ledge's surface
on|the floor|a rug|lying flat against the floor's surface
on|the plate|a pastry|resting on the plate's surface
on|the tray|a teapot|resting on the tray's upper surface
on|the book cover|a sticker|attached to the cover's outside surface
on|the laptop screen|a fingerprint|visible on the screen's surface
on|the whiteboard|a diagram|drawn on the board's surface
on|the path|a fallen leaf|resting on the path's surface
on|the bench|a cushion|resting on the bench's seat
on|the shelf|a trophy|resting on the shelf's upper surface
on|the balcony floor|a mat|lying against the floor's surface
on|the fridge door|a magnet|stuck to the door's outside surface
on|the pavement|a chalk drawing|drawn on the pavement's surface
at|home|a neighbour|using the fixed phrase for being at home
at|work|a colleague|using the fixed phrase for being at work
at|school|a pupil|using the fixed phrase for attending school
at|university|a student|using the British English phrase for attending university
at|the entrance|a steward|treating the entrance as an exact meeting point
at|the reception desk|a receptionist|treating the desk as a service point, not a supporting surface
at|the bus stop|a commuter|treating the stop as a designated waiting point
at|the crossroads|a cyclist|treating the crossroads as a precise meeting point
at|the ticket barrier|a guard|treating the barrier as an exact checkpoint
at|the finish line|a race official|treating the line as a designated race point
`);
export const ongoing = rows(`
I|was|knead|kneading|bread dough|the doorbell rang
you|were|polish|polishing|a brass handle|the phone rang
she|was|weave|weaving|a wool blanket|the visitor arrived
he|was|sand|sanding|a wooden chair|the lights went out
we|were|sort|sorting|donated clothes|the van arrived
they|were|label|labelling|seed packets|the organiser called
the mechanic|was|inspect|inspecting|a car engine|the alarm sounded
the children|were|decorate|decorating|paper crowns|the teacher entered
the guide|was|describe|describing|the castle walls|a bell rang
the dancers|were|rehearse|rehearsing|a new routine|the music stopped
I|was|wrap|wrapping|a birthday gift|the cat jumped up
you|were|measure|measuring|a window frame|the ruler broke
she|was|stitch|stitching|a torn sleeve|the needle snapped
he|was|peel|peeling|a bowl of potatoes|the timer beeped
we|were|load|loading|camping equipment|the rain started
they|were|unpack|unpacking|a delivery of books|the manager appeared
the vet|was|examine|examining|a small rabbit|the assistant knocked
the volunteers|were|serve|serving|hot soup|the guests arrived
the coach|was|demonstrate|demonstrating|a stretching exercise|the whistle blew
the cleaners|were|mop|mopping|the entrance floor|the bucket tipped over
I|was|water|watering|the balcony plants|the hose split
you|were|photograph|photographing|a kingfisher|the boat passed
she|was|type|typing|a meeting agenda|the computer froze
he|was|fold|folding|clean sheets|the baby woke up
we|were|discuss|discussing|a holiday route|the train stopped
they|were|translate|translating|a visitor brochure|the supervisor called
the baker|was|decorate|decorating|a wedding cake|the customer arrived
the students|were|compare|comparing|two diagrams|the lesson ended
the porter|was|wheel|wheeling|a luggage trolley|the lift opened
the musicians|were|tune|tuning|their instruments|the conductor arrived
I|was|grate|grating|a block of cheese|the bowl slipped
you|were|dig|digging|a planting hole|the spade struck a stone
she|was|arrange|arranging|flowers in a vase|the courier knocked
he|was|scan|scanning|old photographs|the scanner stopped
we|were|test|testing|a smoke detector|the caretaker came in
they|were|assemble|assembling|a flat-pack wardrobe|a screw fell out
the ranger|was|observe|observing|a family of otters|the radio crackled
the campers|were|pitch|pitching|their tents|the wind rose
the receptionist|was|print|printing|a room list|the printer jammed
the gardeners|were|trim|trimming|the hedge|a bird flew out
I|was|mix|mixing|pancake batter|the milk spilled
you|were|prune|pruning|a rose bush|the rain began
she|was|iron|ironing|a cotton shirt|the power failed
he|was|record|recording|a weather report|the microphone fell
we|were|plan|planning|a charity walk|the organiser arrived
they|were|rescue|rescuing|a trapped kitten|the owner returned
the jeweller|was|adjust|adjusting|a watch strap|the customer sneezed
the researchers|were|weigh|weighing|soil samples|the scales switched off
the instructor|was|explain|explaining|a safety procedure|the siren sounded
the neighbours|were|clear|clearing|snow from the path|the snowplough passed
`);
export const purposes = rows(`
I opened the curtains|let|letting|more daylight into the room
We brought a cooler|keep|keeping|the picnic drinks cold
She used a ruler|draw|drawing|a straight line
He put on gloves|protect|protecting|his hands from thorns
They hired a van|transport|transporting|the exhibition boards
I set an alarm|wake|waking|up before sunrise
We took a shortcut|reach|reaching|the station sooner
She plugged in the charger|recharge|recharging|her phone battery
He wore a reflective vest|stay|staying|visible in the dark
They installed a ramp|improve|improving|wheelchair access
I saved the receipt|claim|claiming|a refund if necessary
We reserved a table|celebrate|celebrating|our anniversary
She enrolled on a course|develop|developing|her photography skills
He borrowed a ladder|clean|cleaning|the upstairs window
They carried a compass|find|finding|their way through the hills
I bought a notebook|record|recording|new vocabulary
We turned down the music|hear|hearing|the announcement
She moved closer|read|reading|the small print
He tightened the lid|prevent|preventing|a leak
They put up a notice|inform|informing|visitors about the closure
I visited the post office|send|sending|a registered letter
We planted a hedge|create|creating|a sheltered corner
She wore earplugs|block|blocking|the noise
He took a measuring tape|check|checking|the width of the doorway
They joined a choir|meet|meeting|other local singers
I carried a reusable cup|reduce|reducing|disposable waste
We brought binoculars|watch|watching|birds on the island
She backed up the files|avoid|avoiding|losing her work
He opened the window|cool|cooling|the room
They marked the route|guide|guiding|the walkers safely
I practised the speech|build|building|my confidence
We booked an early ferry|arrive|arriving|before the crowds
She used a magnifying glass|examine|examining|the tiny lettering
He checked the forecast|choose|choosing|a dry day for painting
They lit a lantern|illuminate|illuminating|the campsite
I folded the map|fit|fitting|it into my pocket
We labelled the cables|identify|identifying|each connection
She carried a spare tyre|replace|replacing|a damaged one if needed
He asked for directions|locate|locating|the nearest pharmacy
They repaired the fence|stop|stopping|the sheep escaping
I bought a sieve|remove|removing|lumps from the flour
We washed the jars|prepare|preparing|them for making jam
She used a bookmark|remember|remembering|her place in the novel
He lowered the shelf|make|making|the cups easier to reach
They organised a raffle|raise|raising|money for the playground
I put the soup in a flask|take|taking|it on the walk
We borrowed a projector|show|showing|the holiday photographs
She took swimming lessons|learn|learning|a safer swimming technique
He added a handle|carry|carrying|the box more easily
They put a mat by the door|catch|catching|mud from people's shoes
`);
export const complements = rows(`
enjoy|ing|explore|exploring|coastal footpaths
avoid|ing|drive|driving|during the rush hour
consider|ing|rent|renting|a smaller apartment
practise|ing|pronounce|pronouncing|unfamiliar words
finish|ing|edit|editing|the school newsletter
suggest|ing|organise|organising|a neighbourhood picnic
miss|ing|chat|chatting|with old classmates
admit|ing|forget|forgetting|important dates
dislike|ing|queue|queuing|in crowded shops
mind|ing|share|sharing|a desk with a colleague
enjoy|ing|bake|baking|sourdough bread
avoid|ing|waste|wasting|clean drinking water
consider|ing|join|joining|a local orchestra
practise|ing|balance|balancing|on one foot
finish|ing|paint|painting|the hallway walls
suggest|ing|visit|visiting|the science museum
miss|ing|swim|swimming|in the sea
admit|ing|make|making|careless spelling mistakes
dislike|ing|travel|travelling|on crowded trains
mind|ing|wait|waiting|outside for a few minutes
enjoy|ing|solve|solving|word puzzles
avoid|ing|leave|leaving|food uncovered
consider|ing|study|studying|a new language
practise|ing|use|using|the emergency equipment
finish|ing|sort|sorting|the recycling
want|to|borrow|borrowing|a folding chair
hope|to|see|seeing|the northern lights
plan|to|restore|restoring|an old rocking chair
decide|to|take|taking|the evening class
learn|to|repair|repairing|a punctured tyre
offer|to|collect|collecting|the donated blankets
promise|to|return|returning|the borrowed camera
agree|to|supervise|supervising|the school trip
expect|to|receive|receiving|a reply tomorrow
refuse|to|sign|signing|an unread document
choose|to|sit|sitting|near the aisle
prepare|to|welcome|welcoming|the exchange students
ask|to|speak|speaking|to the supervisor
want|to|grow|growing|herbs on the balcony
hope|to|attend|attending|the summer festival
plan|to|build|building|a garden bench
decide|to|sell|selling|unused sports equipment
learn|to|sew|sewing|a simple cloth bag
offer|to|carry|carrying|a neighbour's groceries
promise|to|feed|feeding|the cat every morning
agree|to|revise|revising|the meeting schedule
expect|to|finish|finishing|the project by Friday
refuse|to|pay|paying|an incorrect bill
choose|to|walk|walking|along the riverside
prepare|to|present|presenting|the research findings
`);
export const emotions = rows(`
bored|boring|the repetitive safety video|the trainees
bored|boring|the long wait without anything to read|the passengers
bored|boring|the talk that repeated the same point|the listeners
bored|boring|the game with no decisions to make|the players
bored|boring|the task of copying identical lines|the pupils
interested|interesting|the account of a deep-sea discovery|the readers
interested|interesting|the exhibition of unusual inventions|the visitors
interested|interesting|the lesson about secret codes|the students
interested|interesting|the interview with a wildlife photographer|the viewers
interested|interesting|the demonstration of an ancient craft|the audience
excited|exciting|the announcement of a surprise school trip|the children
excited|exciting|the final lap of a close race|the spectators
excited|exciting|the chance to sing on a large stage|the singers
excited|exciting|the first glimpse of dolphins|the tourists
excited|exciting|the invitation to a national competition|the athletes
confused|confusing|the instructions with contradictory steps|the users
confused|confusing|the map with missing labels|the walkers
confused|confusing|the timetable showing two departure times|the commuters
confused|confusing|the explanation with unfamiliar abbreviations|the apprentices
confused|confusing|the form that asked the same question differently|the applicants
annoyed|annoying|the phone that beeped throughout the film|the cinema audience
annoyed|annoying|the tap that dripped all night|the hotel guests
annoyed|annoying|the advert that interrupted every song|the listeners
annoyed|annoying|the printer that kept jamming|the office staff
annoyed|annoying|the car alarm that would not stop|the neighbours
surprised|surprising|the unexpected arrival of a former teacher|the graduates
surprised|surprising|the discovery of a letter inside an old book|the librarians
surprised|surprising|the unusually early snowfall|the residents
surprised|surprising|the news that a small team had won|the supporters
surprised|surprising|the hidden room behind the bookshelf|the restorers
frightened|frightening|the sudden crash of thunder overhead|the campers
frightened|frightening|the sight of smoke filling the corridor|the residents
frightened|frightening|the loud growl from an unseen animal|the hikers
frightened|frightening|the moment the boat began to rock violently|the passengers
frightened|frightening|the scene of a runaway vehicle|the pedestrians
disappointed|disappointing|the cancellation of a long-awaited concert|the fans
disappointed|disappointing|the meal that arrived cold|the diners
disappointed|disappointing|the closure of the only playground|the families
disappointed|disappointing|the result after months of preparation|the team members
disappointed|disappointing|the news that all the tickets had sold out|the waiting customers
tired|tiring|the long climb with heavy backpacks|the walkers
tired|tiring|the day spent moving furniture upstairs|the helpers
tired|tiring|the overnight journey with several changes|the travellers
tired|tiring|the shift spent standing at a busy counter|the assistants
tired|tiring|the repeated swimming drills|the swimmers
worried|worrying|the report of rising floodwater|the villagers
worried|worrying|the repeated failure of the warning system|the technicians
worried|worrying|the unexplained disappearance of a pet|the owners
worried|worrying|the forecast of severe storms|the sailors
worried|worrying|the news of a damaged bridge on the route|the drivers
`);
