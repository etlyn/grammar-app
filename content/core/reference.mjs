import { define, task as Q, row } from "./engine.mjs";
const L = (...a) => a;
const locations = row(`
into|the studio|from outside to inside the studio
into|the cottage|from outside to inside the cottage
into|the garage|from outside to inside the garage
into|the classroom|from outside to inside the classroom
into|the kitchen|from outside to inside the kitchen
into|the library|from outside to inside the library
into|the museum|from outside to inside the museum
into|the greenhouse|from outside to inside the greenhouse
into|the tent|from outside to inside the tent
into|the shop|from outside to inside the shop
out of|the theatre|from inside to outside the theatre
out of|the office|from inside to outside the office
out of|the station|from inside to outside the station
out of|the waiting room|from inside to outside the waiting room
out of|the dining room|from inside to outside the dining room
out of|the workshop|from inside to outside the workshop
out of|the cabin|from inside to outside the cabin
out of|the restaurant|from inside to outside the restaurant
out of|the hall|from inside to outside the hall
out of|the house|from inside to outside the house
across|the road|from one side of the road to the opposite side
across|the square|from one side of the square to the opposite side
across|the field|from one side of the field to the opposite side
across|the courtyard|from one side of the courtyard to the opposite side
across|the street|from one side of the street to the opposite side
across|the playground|from one side of the playground to the opposite side
across|the lawn|from one side of the lawn to the opposite side
across|the car park|from one side of the car park to the opposite side
across|the terrace|from one side of the terrace to the opposite side
across|the sports court|from one side of the sports court to the opposite side
through|the tunnel|inside the tunnel from its entrance to its exit
through|the corridor|inside the corridor from one end to the other
through|the passage|inside the passage from one end to the other
through|the covered walkway|inside the covered walkway from one end to the other
through|the gate|by passing from one side to the other within the gate opening
through|the archway|by passing from one side to the other within the archway
through|the doorway|by passing from one side to the other within the doorway
through|the underpass|inside the underpass from one end to the other
through|the cave passage|inside the cave passage from one end to the other
through|the subway passage|inside the subway passage from one end to the other
along|the riverbank|following the length of the riverbank
along|the path|following the length of the path
along|the canal towpath|following the length of the canal towpath
along|the pavement|following the length of the pavement
along|the shoreline|following the length of the shoreline
along|the garden wall|following the length of the garden wall
along|the fence|following the length of the fence
along|the promenade|following the length of the promenade
along|the footpath|following the length of the footpath
along|the track|following the length of the track
`);
const names = row(`
France|—|a country with an ordinary short name
Japan|—|a country with an ordinary short name
Canada|—|a country with an ordinary short name
Brazil|—|a country with an ordinary short name
Italy|—|a country with an ordinary short name
Spain|—|a country with an ordinary short name
Germany|—|a country with an ordinary short name
India|—|a country with an ordinary short name
Kenya|—|a country with an ordinary short name
Portugal|—|a country with an ordinary short name
London|—|a city with an ordinary name
Tokyo|—|a city with an ordinary name
Rome|—|a city with an ordinary name
Madrid|—|a city with an ordinary name
Paris|—|a city with an ordinary name
Berlin|—|a city with an ordinary name
Nairobi|—|a city with an ordinary name
Lisbon|—|a city with an ordinary name
Dublin|—|a city with an ordinary name
Vienna|—|a city with an ordinary name
Europe|—|a continent
Asia|—|a continent
Africa|—|a continent
South America|—|a continent
North America|—|a continent
United Kingdom|the|a country name containing Kingdom
United States|the|a plural country name
Netherlands|the|a plural country name
Philippines|the|a plural country name
Czech Republic|the|a country name containing Republic
Nile|the|a river
Thames|the|a river
Amazon|the|a river in the stated geographical sense
Danube|the|a river
Rhine|the|a river
Alps|the|a mountain range
Andes|the|a mountain range
Himalayas|the|a mountain range
Rocky Mountains|the|a mountain range
Pyrenees|the|a mountain range
Pacific Ocean|the|an ocean
Atlantic Ocean|the|an ocean
Indian Ocean|the|an ocean
Mediterranean Sea|the|a sea
Black Sea|the|a sea
Mount Everest|—|an individual named mountain
Mount Fuji|—|an individual named mountain
Lake Victoria|—|a name beginning with Lake
Lake Superior|—|a name beginning with Lake
Lake Geneva|—|a name beginning with Lake
`);
export function buildReference() {
  return [
    define(
      "movement-prepositions",
      "Prepositions of movement and direction",
      "A2",
      "bc-prepositions-reference",
      "Follow a route through space and distinguish a position from a change of position.",
      [
        L(
          "A destination or entry",
          "To points to a destination; into emphasises movement from outside to inside. In usually describes an inside position. Onto highlights movement to a surface, while on commonly describes contact or position on that surface.",
          "We went **to** the station and **into** the building.",
          "Go home normally has no to because home functions adverbially in this construction.",
        ),
        L(
          "Leaving and crossing",
          "Out of indicates movement from inside to outside. Across usually describes travel from one side of a space or surface to another. Through describes travel within an opening, passage or surrounding area. The physical route makes the difference.",
          "Walk **across** the road, then **through** the gate.",
          "Across a tunnel suggests crossing its width or going over its location; through a tunnel follows its interior route.",
        ),
        L(
          "Following or approaching",
          "Along follows the length of something such as a path or river. Towards indicates direction but does not necessarily imply arrival. Past means movement beyond a point; around can describe a route surrounding or avoiding something.",
          "Walk **along** the path **towards** the bridge.",
          "Towards does not by itself say that the destination was reached.",
        ),
        L(
          "Read the whole route",
          "A route can combine several prepositions because each describes a different relation. Identify starting point, boundary, path and destination. Some movements allow several descriptions, so these questions specify the intended route rather than treating all alternatives as wrong in every context.",
          "Go **out of** the house, **across** the square and **into** the café.",
          "In and into can overlap with some verbs. The questions explicitly test the entry/exit distinction.",
        ),
      ],
      locations,
      ([prep, place, route]) => [
        Q(
          "movement-route",
          `Choose the route preposition: “We walked ____ ${place}.” The route is ${route}.`,
          prep,
          `**${prep} ${place}** expresses the specified route: ${route}.`,
          [
            [
              "above",
              "Above expresses a higher position, not this specified route.",
            ],
            [
              "beneath",
              "Beneath expresses a lower position, not this specified route.",
            ],
            [
              "beside",
              "Beside expresses being next to it, not the described passage or crossing.",
            ],
          ],
          "Trace the **route described in words** before choosing the preposition.",
        ),
        Q(
          "movement-meaning",
          `What route does “walk ${prep} ${place}” describe in this exercise?`,
          route,
          `The intended meaning of **${prep}** here is **${route}**.`,
          [
            [
              "remain motionless next to it",
              "Walk describes movement, and beside would indicate the neighbouring position.",
            ],
            [
              "stay above it without moving",
              "The phrase describes a route, not a stationary higher position.",
            ],
            [
              "stay underneath it without moving",
              "The phrase describes movement, not a stationary lower position.",
            ],
          ],
          "Distinguish **movement along a route** from a static position.",
        ),
        Q(
          "destination-home",
          `After walking ${prep} ${place}, we went ____ home. Choose the usual adverbial home construction.`,
          "—",
          "In **went home**, home functions adverbially and takes no to.",
          [
            ["to", "The usual construction is go home, without to."],
            [
              "at",
              "At home describes a position, not the ordinary go home destination construction.",
            ],
            ["in", "In home is not the ordinary destination phrase."],
          ],
          "Home behaves differently from a noun destination such as **the house**.",
        ),
        Q(
          "direction-no-arrival",
          `After walking ${prep} ${place}, we walked towards the station. What does “towards” establish?`,
          "The direction, without necessarily establishing arrival.",
          "**Towards** points in the station’s direction but does not guarantee that we reached it.",
          [
            [
              "That we certainly arrived at the station.",
              "Towards alone does not assert arrival.",
            ],
            [
              "That we remained inside the station.",
              "That would describe a static inside position, not direction.",
            ],
            [
              "That we walked away from the station.",
              "Away from gives the opposite direction.",
            ],
          ],
          "Separate **direction** from **successful arrival**.",
        ),
      ],
    ),
    define(
      "articles-place-names",
      "Articles with place names and institutions",
      "A2",
      "bc-zero-articles",
      "Learn common geographical patterns and distinguish an institution’s purpose from its physical building.",
      [
        L(
          "Names that usually take no article",
          "Most ordinary country and city names take no article, as do continents, individual mountains named with Mount, and lakes named with Lake. These are naming conventions rather than a universal rule for all proper nouns.",
          "**France**, **Tokyo**, **Mount Fuji**, **Lake Victoria**",
          "The Hague is a city-name exception. Check unfamiliar names rather than guessing solely from the place category.",
        ),
        L(
          "Names that commonly take the",
          "River, sea, ocean and mountain-range names commonly take **the**. Some country names also do, especially plural names or names containing words such as Kingdom and Republic. Short and full official names can behave differently.",
          "**the Nile**, **the Alps**, **the United Kingdom**",
          "Czechia normally has no article; the Czech Republic takes the. The chosen name matters.",
        ),
        L(
          "Institutional purpose and the building",
          "In British English, go to school, be in prison and be in hospital can refer to the institution’s usual role. The school or the hospital often identifies a particular building or site. American usage differs notably for in the hospital.",
          "The pupil is **at school**. / The builder is **at the school**.",
          "Do not mark American in the hospital wrong without specifying the variety and intended meaning.",
        ),
        L(
          "Names inside larger noun phrases",
          "A geographical name can occur inside a larger noun phrase, where an article may belong to another noun. The history of France has the before history, not before France. A new context can also make a proper name descriptive: the Paris of my childhood.",
          "**The history of France** is the subject.",
          "The exercises test ordinary geographical reference, not special descriptive or metaphorical uses of names.",
        ),
      ],
      names,
      ([name, article, kind]) => {
        const full = article === "the" ? `the ${name}` : name;
        return [
          Q(
            "geographic-article",
            `Use ordinary geographical reference to ${kind}: “We studied a map of ____ ${name}.” (— = no article)`,
            article,
            `In ordinary geographical reference, **${full}** uses ${article === "the" ? "the" : "no article"} because it is ${kind}.`,
            [
              [
                "a",
                "A would not give the ordinary identified geographical name in this context.",
              ],
              [
                "an",
                "An would not give the ordinary identified geographical name in this context.",
              ],
              [
                article === "the" ? "—" : "the",
                article === "the"
                  ? `This geographical name conventionally takes **the**: ${full}.`
                  : `This ordinary use of the name takes **no article**: ${name}.`,
              ],
            ],
            `Identify the name’s category: **${kind}**.`,
          ),
          Q(
            "article-in-of-phrase",
            `Complete ordinary naming inside an of-phrase: “The geography of ____ ${name} was our subject.”`,
            article,
            `The first the belongs to geography. The place itself is still **${full}**.`,
            [
              ["a", "A does not give the ordinary geographical name here."],
              ["an", "An does not give the ordinary geographical name here."],
              [
                article === "the" ? "—" : "the",
                `The of-phrase does not change the ordinary naming pattern **${full}**.`,
              ],
            ],
            "The article before **geography** does not determine the article inside the following **of-phrase**.",
          ),
          Q(
            "name-category",
            `Which category explains the ordinary article pattern for “${full}”?`,
            kind,
            `The name **${full}** is ${kind}; that category helps explain its conventional article use.`,
            [
              "a personal name",
              "an ordinary unnamed countable object",
              "a verb describing movement",
            ].map((x) => [
              x,
              `This does not describe the geographical name ${full}; it is ${kind}.`,
            ]),
            "Identify the geographical category before applying its naming convention.",
          ),
          Q(
            "complete-name-phrase",
            `Choose the ordinary geographical name phrase to complete “Our lesson concerned ____.” The place is ${name.toLowerCase()} (${kind}).`,
            full,
            `The complete ordinary name phrase is **${full}**. Keep the established article convention and the proper-name capitals.`,
            [
              [
                `a ${name}`,
                "A does not give the ordinary geographical naming pattern requested.",
              ],
              [
                `an ${name}`,
                "An does not give the ordinary geographical naming pattern requested.",
              ],
              [
                article === "the" ? name : `the ${name}`,
                `The ordinary naming convention here requires **${full}**.`,
              ],
            ],
            "Build the complete noun phrase from the place category and its established name.",
          ),
        ];
      },
    ),
  ];
}
