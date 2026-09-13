// Authored practice contexts. These are not copied publisher exercises.
// Explicit forms avoid relying on an unreliable automatic English inflector.
export const verbs = `
cook|cooks|cooked|cooking|dinner in the kitchen
wash|washes|washed|washing|the cups after breakfast
carry|carries|carried|carrying|a heavy bag to the station
study|studies|studied|studying|French at the library
play|plays|played|playing|tennis in the park
watch|watches|watched|watching|a film in the living room
clean|cleans|cleaned|cleaning|the windows in the classroom
open|opens|opened|opening|the shop at the corner
close|closes|closed|closing|the garden gate
visit|visits|visited|visiting|a cousin in the city
help|helps|helped|helping|a neighbour with the shopping
paint|paints|painted|painting|the fence behind the house
plant|plants|planted|planting|flowers near the entrance
collect|collects|collected|collecting|bottles for recycling
repair|repairs|repaired|repairing|a bicycle in the garage
practise|practises|practised|practising|a song for the concert
answer|answers|answered|answering|questions about the project
pack|packs|packed|packing|a suitcase for the trip
check|checks|checked|checking|the timetable at the station
deliver|delivers|delivered|delivering|letters to the office
finish|finishes|finished|finishing|a report for the manager
fix|fixes|fixed|fixing|a broken shelf in the hallway
try|tries|tried|trying|a new recipe at home
copy|copies|copied|copying|a diagram from the board
move|moves|moved|moving|a desk into the study
write|writes|wrote|writing|a letter to a friend
read|reads|read|reading|a story to the children
make|makes|made|making|a sandwich for lunch
take|takes|took|taking|photographs of the bridge
bring|brings|brought|bringing|snacks to the meeting
buy|buys|bought|buying|fruit at the market
choose|chooses|chose|choosing|a book for the journey
wear|wears|wore|wearing|a blue jacket at work
drink|drinks|drank|drinking|a glass of water after exercise
eat|eats|ate|eating|soup in the dining room
sing|sings|sang|singing|a song with the choir
teach|teaches|taught|teaching|English at the community centre
build|builds|built|building|a model of a house
draw|draws|drew|drawing|a map of the neighbourhood
send|sends|sent|sending|a message to the team
sweep|sweeps|swept|sweeping|the floor near the door
feed|feeds|fed|feeding|the birds in the garden
sell|sells|sold|selling|bread at the bakery
hold|holds|held|holding|a sign outside the theatre
cut|cuts|cut|cutting|paper for the art project
put|puts|put|putting|clean plates on the table
set|sets|set|setting|the table for dinner
leave|leaves|left|leaving|a note on the desk
meet|meets|met|meeting|a colleague at the cafe
pay|pays|paid|paying|the bill at the counter
`
  .trim()
  .split("\n")
  .map((line) => line.split("|"));

export const beContexts = `
I|am|ready for the music lesson
you|are|early for the appointment
he|is|responsible for the keys
she|is|interested in the exhibition
it|is|cold inside the garage
we|are|near the ticket office
they|are|proud of the school team
the classroom|is|empty after lunch
the books|are|on the bottom shelf
my brother|is|a nurse at the hospital
our neighbours|are|friendly and helpful
the bus|is|full this morning
the tickets|are|inside the envelope
the soup|is|hot enough to serve
the windows|are|open in the hall
I|am|nervous about the interview
you|are|welcome at the workshop
he|is|careful with the equipment
she|is|away from her desk
it|is|quiet in the reading room
we|are|excited about the journey
they|are|busy with the preparations
the museum|is|free on Sundays
the children|are|safe in the playground
the first lesson|is|about local history
the apples|are|fresh from the orchard
my coat|is|too small for me
the roads|are|wet after the storm
the bread|is|still warm
our bags|are|under the bench
I|am|available after four
you|are|right about the address
he|is|absent from class today
she|is|good at solving puzzles
it|is|dark outside the tent
we|are|happy with the results
they|are|tired after the hike
the hotel|is|opposite the station
the cups|are|clean and dry
the shop assistant|is|polite to everyone
the flowers|are|yellow and white
the map|is|useful for visitors
the instructions|are|easy to follow
the garden|is|beautiful in spring
the stairs|are|narrow near the top
the train|is|late this evening
the students|are|in the computer room
the table|is|made of wood
the matches|are|in a small box
the water|is|clear in this stream
`
  .trim()
  .split("\n")
  .map((line) => line.split("|"));

// singular, plural, indefinite article; pronunciation is explicit, not letter-based.
export const nouns = `
apple|apples|an
banana|bananas|a
orange|oranges|an
pear|pears|a
egg|eggs|an
sandwich|sandwiches|a
umbrella|umbrellas|an
backpack|backpacks|a
envelope|envelopes|an
postcard|postcards|a
onion|onions|an
carrot|carrots|a
avocado|avocados|an
tomato|tomatoes|a
apron|aprons|an
scarf|scarves|a
earring|earrings|an
bracelet|bracelets|a
armchair|armchairs|an
sofa|sofas|a
oven|ovens|an
kettle|kettles|a
alarm clock|alarm clocks|an
lamp|lamps|a
atlas|atlases|an
dictionary|dictionaries|a
exercise book|exercise books|an
pencil|pencils|a
ink cartridge|ink cartridges|an
printer|printers|a
extension cable|extension cables|an
keyboard|keyboards|a
electric guitar|electric guitars|an
violin|violins|a
air ticket|air tickets|an
train ticket|train tickets|a
audio guide|audio guides|an
map|maps|a
ice cream cone|ice cream cones|an
biscuit|biscuits|a
ID card|ID cards|an
uniform|uniforms|a
hourglass|hourglasses|an
university textbook|university textbooks|a
USB cable|USB cables|a
one-way ticket|one-way tickets|a
X-ray image|X-ray images|an
European flag|European flags|a
honorary badge|honorary badges|an
useful tool|useful tools|a
`
  .trim()
  .split("\n")
  .map((line) => line.split("|"));

export const comparisons = `
tall|taller|tallest|trees
short|shorter|shortest|pencils
long|longer|longest|ropes
small|smaller|smallest|boxes
large|larger|largest|rooms
wide|wider|widest|roads
narrow|narrower|narrowest|paths
high|higher|highest|walls
low|lower|lowest|shelves
deep|deeper|deepest|pools
shallow|shallower|shallowest|ponds
old|older|oldest|buildings
young|younger|youngest|players
new|newer|newest|computers
fast|faster|fastest|trains
slow|slower|slowest|runners
cheap|cheaper|cheapest|tickets
bright|brighter|brightest|lamps
dark|darker|darkest|curtains
light|lighter|lightest|bags
heavy|heavier|heaviest|suitcases
easy|easier|easiest|puzzles
busy|busier|busiest|stations
noisy|noisier|noisiest|streets
quiet|quieter|quietest|classrooms
clean|cleaner|cleanest|windows
dirty|dirtier|dirtiest|shoes
warm|warmer|warmest|coats
cold|colder|coldest|drinks
hot|hotter|hottest|ovens
wet|wetter|wettest|towels
dry|drier|driest|clothes
thin|thinner|thinnest|notebooks
thick|thicker|thickest|blankets
big|bigger|biggest|gardens
safe|safer|safest|routes
strong|stronger|strongest|ropes
weak|weaker|weakest|signals
soft|softer|softest|pillows
hard|harder|hardest|surfaces
expensive|more expensive|most expensive|hotels
comfortable|more comfortable|most comfortable|chairs
interesting|more interesting|most interesting|stories
useful|more useful|most useful|guides
careful|more careful|most careful|drivers
reliable|more reliable|most reliable|machines
colourful|more colourful|most colourful|posters
popular|more popular|most popular|cafes
good|better|best|results
bad|worse|worst|mistakes
`
  .trim()
  .split("\n")
  .map((line) => line.split("|"));

export const timeMarkers = `
at|six o'clock
at|7:30 a.m.
at|noon
at|midnight
at|dawn
at|sunrise
at|sunset
at|lunchtime
at|bedtime
at|three o'clock
on|Monday
on|Tuesday
on|Wednesday
on|Thursday
on|Friday
on|Saturday
on|Sunday
on|12 May
on|1 January
on|24 June
on|Monday morning
on|Tuesday afternoon
on|Friday evening
on|Saturday night
on|New Year's Day
in|January
in|February
in|March
in|April
in|May
in|June
in|July
in|August
in|September
in|October
in|November
in|December
in|the morning
in|the afternoon
in|the evening
—|next Monday
—|next Tuesday
—|next week
—|next month
—|next year
—|tomorrow
—|this afternoon
—|this evening
—|this Friday
—|this Sunday
`
  .trim()
  .split("\n")
  .map((line) => line.split("|"));
