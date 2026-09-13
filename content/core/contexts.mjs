import { row } from "./engine.mjs";
// Fifty distinct transitive situations; all forms and objects authored explicitly.
export const actions = row(`
prepare|prepares|prepared|preparing|the visitor guide
restore|restores|restored|restoring|the old portrait
measure|measures|measured|measuring|the garden fence
translate|translates|translated|translating|the travel leaflet
inspect|inspects|inspected|inspecting|the safety equipment
organise|organises|organised|organising|the village festival
print|prints|printed|printing|the concert programme
repair|repairs|repaired|repairing|the kitchen cupboard
check|checks|checked|checking|the weather report
record|records|recorded|recording|the radio interview
pack|packs|packed|packing|the emergency supplies
label|labels|labelled|labelling|the museum exhibits
deliver|delivers|delivered|delivering|the wedding invitations
paint|paints|painted|painting|the bedroom ceiling
clean|cleans|cleaned|cleaning|the laboratory windows
sort|sorts|sorted|sorting|the donated clothes
arrange|arranges|arranged|arranging|the classroom furniture
photograph|photographs|photographed|photographing|the migrating birds
review|reviews|reviewed|reviewing|the training manual
design|designs|designed|designing|the exhibition poster
update|updates|updated|updating|the bus timetable
water|waters|watered|watering|the greenhouse plants
count|counts|counted|counting|the remaining tickets
replace|replaces|replaced|replacing|the worn carpet
polish|polishes|polished|polishing|the silver trophies
mend|mends|mended|mending|the torn curtain
collect|collects|collected|collecting|the empty bottles
copy|copies|copied|copying|the historical map
test|tests|tested|testing|the fire alarm
decorate|decorates|decorated|decorating|the community hall
scan|scans|scanned|scanning|the archived documents
assemble|assembles|assembled|assembling|the flat-pack desk
weigh|weighs|weighed|weighing|the sample materials
load|loads|loaded|loading|the delivery van
unpack|unpacks|unpacked|unpacking|the medical supplies
edit|edits|edited|editing|the school magazine
wash|washes|washed|washing|the cotton aprons
fold|folds|folded|folding|the clean towels
sharpen|sharpens|sharpened|sharpening|the carving tools
mark|marks|marked|marking|the walking route
save|saves|saved|saving|the research notes
post|posts|posted|posting|the invitation cards
wrap|wraps|wrapped|wrapping|the birthday presents
move|moves|moved|moving|the heavy bookcase
examine|examines|examined|examining|the antique clock
number|numbers|numbered|numbering|the display shelves
install|installs|installed|installing|the new handrail
compare|compares|compared|comparing|the survey results
prepare|prepares|prepared|preparing|the evening meal
repair|repairs|repaired|repairing|the rowing boat
`).map(([v, s, p, g, o]) => ({
  v,
  s,
  p,
  g,
  o,
  plural:
    /\b(supplies|exhibits|invitations|windows|clothes|birds|plants|tickets|trophies|bottles|documents|materials|aprons|towels|tools|notes|cards|presents|shelves|results)\b/.test(
      o,
    ),
}));
export const nouns = row(`
book|books
box|boxes
city|cities
child|children
woman|women
man|men
person|people
mouse|mice
tooth|teeth
foot|feet
leaf|leaves
knife|knives
shelf|shelves
wolf|wolves
wife|wives
life|lives
baby|babies
story|stories
country|countries
family|families
party|parties
lady|ladies
key|keys
toy|toys
boy|boys
day|days
bus|buses
watch|watches
dish|dishes
brush|brushes
church|churches
class|classes
wish|wishes
fox|foxes
tomato|tomatoes
potato|potatoes
photo|photos
piano|pianos
roof|roofs
belief|beliefs
sheep|sheep
deer|deer
fish|fish
species|species
series|series
pen|pens
chair|chairs
table|tables
bottle|bottles
cup|cups
`).map(([one, many]) => ({ one, many }));

// Perfect constructions also exercise irregular participles; these are authored, not inferred.
export const perfectActions = actions.slice(0, 25).concat(
  row(`
write|written|writing|the invitation letter
read|read|reading|the safety instructions
make|made|making|the birthday cake
take|taken|taking|the official photographs
bring|brought|bringing|the spare equipment
buy|bought|buying|the fresh vegetables
choose|chosen|choosing|the holiday destination
find|found|finding|the missing documents
send|sent|sending|the application form
build|built|building|the garden wall
draw|drawn|drawing|the route map
break|broken|breaking|the old tiles
cut|cut|cutting|the wrapping paper
put|put|putting|the tools in the cupboard
leave|left|leaving|the spare key with a neighbour
sell|sold|selling|the handmade pottery
teach|taught|teaching|the new dance routine
tell|told|telling|the story to the children
show|shown|showing|the visitors around the museum
wear|worn|wearing|the protective clothing
eat|eaten|eating|the packed lunch
drink|drunk|drinking|the fruit juice
hold|held|holding|the door open
keep|kept|keeping|the meeting records
sweep|swept|sweeping|the kitchen floor
`).map(([v, p, g, o]) => ({ v, p, g, o })),
);
