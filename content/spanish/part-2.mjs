// Original AI-assisted Spanish reading and practice; reference guidance only.
// Each row is an individually authored situation, not a lexical permutation.
const r = (
  key,
  title,
  explanation,
  pattern,
  examples,
  commonMistakes,
  rows,
) => ({
  key,
  title,
  explanation,
  pattern,
  examples,
  commonMistakes,
  rows,
});
const c = (slug, title, level, stage, summary, sections) => ({
  slug,
  title,
  level,
  stage,
  summary,
  guidance:
    "Read the patterns, compare the examples, then use the stated context to choose one answer. Regional alternatives are identified where relevant.",
  learningGoals: sections.map((s) => s.title),
  introduction: [
    summary,
    "The examples and exercises are original teaching material. These course levels describe a learning sequence, not a certified assessment.",
  ],
  referenceIds: ["cervantes-b1-b2", "rae-dpd"],
  rules: sections.map(({ rows, ...section }) => section),
  questions: sections.flatMap((section) =>
    section.rows.map(([key, prompt, correct, distractors, explanation]) => ({
      key,
      skill: section.key,
      prompt,
      correct,
      distractors,
      hint: section.pattern,
      explanation,
    })),
  ),
});
const S4 = "4 · Connecting ideas";
const S5 = "5 · Mood and intention";
const S6 = "6 · Nuance and control";

export const chapters = [
  c(
    "es-object-pronouns",
    "Direct and indirect object pronouns",
    "B1",
    S4,
    "Object pronouns connect an action to what is affected and to its recipient. Identify the function before choosing gender and number.",
    [
      r(
        "direct-object",
        "Replace the direct object",
        "Lo, la, los and las replace third-person direct objects. Match the noun’s grammatical gender and number. This chapter uses inanimate objects so accepted personal leísmo does not create competing answers.",
        "Verb + thing → lo / la / los / las + finite verb",
        [
          "La maleta pesa; la llevo yo. — The suitcase is heavy; I will carry it.",
          "Compré los billetes y los guardé. — I bought the tickets and put them away.",
        ],
        ["Do not choose le merely because the object follows a verb."],
        [
          [
            "receipt",
            "El recibo está en el bolsillo. ___ necesito para devolver la chaqueta.",
            "Lo",
            [
              ["La", "Recibo is masculine."],
              ["Los", "There is one receipt."],
              ["Las", "Recibo is masculine and singular."],
            ],
            "Lo replaces el recibo, a masculine singular direct object.",
          ],
          [
            "windows",
            "Las ventanas están sucias. Hoy ___ limpiamos.",
            "las",
            [
              ["la", "There is more than one window."],
              ["los", "Ventanas is feminine."],
              ["lo", "The object is feminine plural."],
            ],
            "Las replaces the feminine plural object las ventanas.",
          ],
          [
            "contract",
            "Este contrato tiene un error. La abogada ___ revisará.",
            "lo",
            [
              ["la", "Contrato is masculine."],
              ["les", "This is a document, not a recipient."],
              ["los", "Only one contract is mentioned."],
            ],
            "The contract is the thing reviewed, so use masculine singular lo.",
          ],
          [
            "keys",
            "No encuentro las llaves. ¿Tú ___ has visto?",
            "las",
            [
              ["los", "Llaves is feminine."],
              ["la", "The keys are plural."],
              ["lo", "The object is feminine plural."],
            ],
            "Las refers back to the keys, not to the person seeing them.",
          ],
          [
            "map",
            "Los mapas nuevos son útiles. ___ consulto antes de salir.",
            "Los",
            [
              ["Lo", "Mapas is plural."],
              ["Las", "Mapas is masculine."],
              ["Les", "The maps are direct objects, not recipients."],
            ],
            "Los replaces los mapas as the direct object of consulto.",
          ],
          [
            "appointment-card",
            "La tarjeta de la cita está aquí. ___ guardo en la cartera.",
            "La",
            [
              ["Lo", "Tarjeta is feminine."],
              ["Las", "Only one card is mentioned."],
              ["Le", "The card is the object being stored."],
            ],
            "La agrees with the feminine singular noun tarjeta.",
          ],
        ],
      ),
      r(
        "indirect-object",
        "Name the recipient",
        "Le and les represent third-person indirect objects. They distinguish singular and plural recipients, not masculine and feminine. A following a-phrase can clarify the recipient.",
        "le = to him / her / you; les = to them / you plural",
        [
          "Le envié una foto a mi hermana. — I sent my sister a photo.",
          "Les preparé café a los invitados. — I made the guests coffee.",
        ],
        ["Do not make le feminine or make it agree with the gift."],
        [
          [
            "neighbor-message",
            "A mi vecina ___ envié la dirección por mensaje.",
            "le",
            [
              ["les", "The recipient is singular."],
              [
                "la",
                "The address is sent to the neighbor; she is the recipient.",
              ],
              ["lo", "Lo does not represent this indirect object."],
            ],
            "Le refers to the singular recipient mi vecina.",
          ],
          [
            "volunteers",
            "A los voluntarios ___ explicaron las normas antes de empezar.",
            "les",
            [
              ["le", "There are several recipients."],
              ["los", "The rules are explained to them."],
              ["las", "Las would refer to a feminine direct object."],
            ],
            "Les agrees in number with los voluntarios, the people receiving the explanation.",
          ],
          [
            "daughter",
            "La médica ___ recetó una crema a mi hija.",
            "le",
            [
              ["la", "The daughter receives the prescription."],
              ["les", "Only one daughter is mentioned."],
              ["las", "Las cannot express this singular recipient."],
            ],
            "Le marks the recipient; una crema is the direct object.",
          ],
          [
            "museum-desk",
            "A los visitantes ___ dieron un plano en la entrada.",
            "les",
            [
              ["le", "Visitantes is plural."],
              ["lo", "Lo would refer to a masculine singular thing."],
              ["la", "La would refer to a feminine singular direct object."],
            ],
            "The visitors receive a map, so plural les is needed.",
          ],
          [
            "technician",
            "A la técnica ___ faltan dos piezas para reparar el aparato.",
            "le",
            [
              ["les", "The person needing the pieces is singular."],
              [
                "la",
                "Faltar takes an indirect object for the affected person.",
              ],
              ["los", "Los would be a masculine plural direct object."],
            ],
            "Le identifies the singular person affected by the missing pieces.",
          ],
          [
            "parents",
            "A mis padres ___ interesa la historia local.",
            "les",
            [
              ["le", "Padres is plural."],
              ["los", "Interesar uses an indirect object for the experiencer."],
              ["las", "Las does not express this indirect object."],
            ],
            "Les identifies the two people interested; la historia is the grammatical subject.",
          ],
        ],
      ),
      r(
        "first-second-object",
        "Use me, te and nos",
        "Me, te and nos can be direct or indirect objects. Their form follows the person referred to; the verb and context reveal their function.",
        "me = me / to me; te = you / to you; nos = us / to us",
        [
          "¿Me oyes? — Can you hear me?",
          "Nos mandaron el horario. — They sent us the timetable.",
        ],
        ["Do not use a third-person pronoun for the speaker."],
        [
          [
            "hear-speaker",
            "I ask whether you can hear me: ¿___ oyes desde allí?",
            "Me",
            [
              ["Te", "Te refers to you, not me."],
              ["Nos", "Nos means us."],
              ["Les", "Les refers to third-person recipients."],
            ],
            "Me represents the speaker as the person heard.",
          ],
          [
            "group-help",
            "We ask for help for ourselves: ¿Puedes ayudar___ con estas cajas?",
            "nos",
            [
              ["me", "Me refers to one speaker only."],
              ["te", "Te would refer to the listener."],
              ["les", "Les refers to third-person recipients."],
            ],
            "Nos attaches to ayudar and represents the whole speaking group.",
          ],
          [
            "listener-call",
            "I promise to call you, one familiar person: ___ llamaré al llegar.",
            "Te",
            [
              ["Me", "Me would refer to myself."],
              ["Nos", "Nos means us."],
              ["Los", "Los is third-person masculine plural."],
            ],
            "Te is the object form for familiar singular tú.",
          ],
          [
            "speaker-gift",
            "I describe a present given to me: Mi tía ___ regaló una bufanda.",
            "me",
            [
              ["te", "Te makes the listener the recipient."],
              ["nos", "Nos changes the recipient to us."],
              ["les", "Les refers to several third persons."],
            ],
            "Me identifies the speaker as the recipient of the scarf.",
          ],
          [
            "group-photo",
            "We are all in the photo: La fotógrafa ___ retrató juntos.",
            "nos",
            [
              ["me", "Me identifies only one person."],
              ["te", "Te identifies the listener alone."],
              ["le", "Le does not represent the speaking group."],
            ],
            "Nos replaces the group including the speaker.",
          ],
          [
            "listener-ticket",
            "I bought a ticket for you, one familiar friend: ___ compré una entrada.",
            "Te",
            [
              ["Me", "Me would mean for myself."],
              ["Nos", "Nos would mean for us."],
              ["Les", "Les is plural third person."],
            ],
            "Te marks the familiar singular recipient of the ticket.",
          ],
        ],
      ),
      r(
        "finite-placement",
        "Place a clitic before a finite verb",
        "In ordinary contemporary statements, object clitics precede a simple finite verb. In a compound tense they precede the auxiliary haber; they do not sit between haber and its participle.",
        "clitic + conjugated verb; clitic + haber + participle",
        [
          "La he leído dos veces. — I have read it twice.",
          "No los conozco. — I do not know them.",
        ],
        ["Do not insert a pronoun between he and leído."],
        [
          [
            "book-perfect",
            "Replace el informe, keeping the present perfect: ___ leído con cuidado.",
            "Lo he",
            [
              ["He lo", "The clitic cannot split haber from its participle."],
              ["He le", "Le is misplaced and does not replace the document."],
              ["Lo ha", "Ha does not agree with the intended yo."],
            ],
            "Lo precedes he; the completed phrase is Lo he leído.",
          ],
          [
            "negation",
            "Replace las botellas: No ___ reciclamos aquí.",
            "las",
            [
              ["reciclamos las", "The finite verb is already present."],
              ["la", "Botellas is plural."],
              ["los", "Botellas is feminine."],
            ],
            "No comes before the clitic, which precedes reciclamos.",
          ],
          [
            "simple-past",
            "Choose the ordinary modern order for “I found it” (la pulsera): ___.",
            "La encontré",
            [
              [
                "Encontré la",
                "A nounless article cannot replace the object after this finite verb.",
              ],
              ["Encontré ella", "Ella is not an unstressed object form."],
              [
                "La encontrar",
                "The infinitive is not the required past-tense verb.",
              ],
            ],
            "La goes before the simple finite past form encontré.",
          ],
          [
            "plural-perfect",
            "Replace las entradas: ___ comprado por internet. (We have bought them.)",
            "Las hemos",
            [
              ["Hemos las", "The clitic precedes haber."],
              ["La hemos", "Entradas is plural."],
              ["Las han", "Han expresses they/you plural, not we."],
            ],
            "Las precedes hemos comprado and agrees with las entradas.",
          ],
          [
            "recipient-negative",
            "A tu hermano no ___ he enviado la factura todavía.",
            "le",
            [
              ["he le", "The pronoun cannot go after the existing he."],
              ["les", "The recipient is singular."],
              ["la", "The brother is the recipient, not the feminine bill."],
            ],
            "The sequence is no + le + he + enviado.",
          ],
          [
            "question-perfect",
            "Replace los documentos: ¿___ has firmado ya?",
            "Los",
            [
              ["Has los", "The auxiliary has is already present."],
              ["Lo", "Documentos is plural."],
              ["Las", "Documentos is masculine."],
            ],
            "The clitic still precedes the auxiliary in a question.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-clitic-combinations",
    "Two pronouns and their placement",
    "B1",
    S4,
    "When an action has both a recipient and an object, Spanish puts the recipient pronoun first. Placement depends on the verb form.",
    [
      r(
        "se-substitution",
        "Change le or les to se before lo or la",
        "Le and les become se immediately before lo, la, los or las. Se does not show the number of recipients; the following pronoun agrees with the thing.",
        "le / les + lo / la / los / las → se + lo / la / los / las",
        [
          "El plano: se lo di a Clara. — I gave it to Clara.",
          "Las fotos: se las mandé a mis primos. — I sent them to my cousins.",
        ],
        ["Never write le lo or les las."],
        [
          [
            "passport-clerk",
            "Di el pasaporte a la agente. Ahora ___ entrego otra vez.",
            "se lo",
            [
              ["le lo", "Le changes to se before lo."],
              ["se la", "Pasaporte is masculine."],
              ["lo se", "Recipient precedes direct object."],
            ],
            "Se represents the agent; lo represents el pasaporte.",
          ],
          [
            "recipe-friends",
            "La receta para mis amigos: ___ envié ayer.",
            "se la",
            [
              ["les la", "Les changes to se before la."],
              ["se las", "Only one recipe is mentioned."],
              ["la se", "The pronoun order is reversed."],
            ],
            "The recipients are plural, but se stays unchanged; la agrees with receta.",
          ],
          [
            "chairs-school",
            "Las sillas eran para el colegio. ___ donamos en junio.",
            "Se las",
            [
              ["Le las", "Le becomes se before las."],
              ["Se los", "Sillas is feminine."],
              ["Las se", "The recipient must come first."],
            ],
            "Se las means the chairs were donated to the school.",
          ],
          [
            "tools-coworkers",
            "Los compañeros pidieron los martillos. ___ presté.",
            "Se los",
            [
              ["Les los", "Les cannot directly precede los."],
              ["Se lo", "Martillos is plural."],
              ["Los les", "The recipient must come before the direct object."],
            ],
            "Se replaces les, while los refers to the plural tools.",
          ],
          [
            "message-grandmother",
            "El mensaje era para mi abuela. ___ leí en voz alta.",
            "Se lo",
            [
              ["Le lo", "Le must become se."],
              ["Se la", "Mensaje is masculine."],
              [
                "Lo la",
                "Neither form expresses the singular indirect object here.",
              ],
            ],
            "The grandmother is the recipient; the masculine message is lo.",
          ],
          [
            "letters-manager",
            "La directora necesitaba las cartas. ___ llevé al despacho.",
            "Se las",
            [
              ["Le las", "Le changes to se before las."],
              ["Se los", "Cartas is feminine."],
              ["Las le", "The order is indirect before direct."],
            ],
            "Se las preserves both the recipient and the feminine plural object.",
          ],
        ],
      ),
      r(
        "recipient-first",
        "Keep the recipient before the thing",
        "Me, te and nos do not change to se. They come before the direct-object pronoun.",
        "me / te / nos + lo / la / los / las",
        [
          "¿Me lo explicas? — Can you explain it to me?",
          "Te las guardo. — I will keep them for you.",
        ],
        ["Do not reverse me lo to lo me."],
        [
          [
            "speaker-proof",
            "El justificante es para mí. ¿___ puedes imprimir?",
            "Me lo",
            [
              ["Lo me", "Recipient comes first."],
              ["Se lo", "Se would refer to a third-person recipient."],
              ["Me la", "Justificante is masculine."],
            ],
            "Me identifies the speaker; lo replaces el justificante.",
          ],
          [
            "friend-jacket",
            "La chaqueta es para ti. ___ dejo en la silla.",
            "Te la",
            [
              ["La te", "The object pronouns are reversed."],
              ["Te lo", "Chaqueta is feminine."],
              ["Se la", "Se would change the recipient."],
            ],
            "Te la means I leave the jacket for you.",
          ],
          [
            "our-results",
            "Los resultados son para nosotros. ¿___ explicas?",
            "Nos los",
            [
              ["Los nos", "The indirect object comes first."],
              ["Nos lo", "Resultados is plural."],
              ["Me los", "Me would make only the speaker the recipient."],
            ],
            "Nos is the group receiving the explanation; los is the results.",
          ],
          [
            "speaker-copy",
            "La copia es para mí. El archivo ___ enviaron anoche.",
            "me lo",
            [
              ["lo me", "The order is reversed."],
              ["te lo", "Te changes the recipient to you."],
              ["me la", "Archivo, the thing sent, is masculine."],
            ],
            "Me lo refers to the file sent to the speaker, not to the feminine word copia.",
          ],
          [
            "your-glasses",
            "Tus gafas están listas. ___ traigo ahora. (I bring them to you.)",
            "Te las",
            [
              ["Las te", "Recipient comes first."],
              ["Te los", "Gafas is feminine."],
              ["Nos las", "Nos would make us the recipients."],
            ],
            "Te las agrees with the intended recipient and the feminine plural glasses.",
          ],
          [
            "our-route",
            "El itinerario es para nuestro grupo. ___ dieron en recepción.",
            "Nos lo",
            [
              ["Lo nos", "The order is reversed."],
              ["Nos los", "Only one itinerary is mentioned."],
              ["Se lo", "Se does not mean to us."],
            ],
            "Nos lo represents one itinerary given to the speaking group.",
          ],
        ],
      ),
      r(
        "infinitive-gerund",
        "Attach pronouns to infinitives and gerunds",
        "With a verb phrase such as poder hacer or estar leyendo, both clitics may precede the finite verb or attach together to the infinitive or gerund. Do not split the pair. Written accents may be needed.",
        "Se lo puedo dar = Puedo dárselo; se lo estoy leyendo = estoy leyéndoselo",
        [
          "Voy a explicártelo. — I am going to explain it to you.",
          "Estoy mostrándoselas. — I am showing them to him/her/them.",
        ],
        ["Do not put one clitic before the auxiliary and attach the other."],
        [
          [
            "explain-plan",
            "Attach both pronouns: Quiero ___ . (explain el plan to you: tú)",
            "explicártelo",
            [
              ["explicar te lo", "Attached clitics form one written word."],
              ["explicarlote", "Recipient must precede direct object."],
              ["explicartela", "Plan is masculine."],
            ],
            "Explicar + te + lo becomes explicártelo, with an accent preserving stress.",
          ],
          [
            "return-phone",
            "Attach both pronouns: Voy a ___ . (return el móvil to her)",
            "devolvérselo",
            [
              ["devolverlelo", "Le changes to se before lo."],
              ["devolverlose", "The order is reversed."],
              ["devolvérsela", "Móvil is masculine."],
            ],
            "The attached recipient is se, followed by lo for el móvil.",
          ],
          [
            "reading-instructions",
            "Attach both pronouns: Estoy ___ . (reading las instrucciones to him)",
            "leyéndoselas",
            [
              ["leyéndoleslas", "Les cannot precede las."],
              ["leyéndolasle", "The pronoun order is reversed."],
              ["leyéndoselos", "Instrucciones is feminine."],
            ],
            "Leyendo + se + las takes an accent: leyéndoselas.",
          ],
          [
            "offer-seats",
            "Keep both pronouns before the finite verb: ___ podemos ofrecer. (los asientos to them)",
            "Se los",
            [
              ["Les los", "Les changes to se."],
              ["Los se", "The recipient comes first."],
              ["Se lo", "Asientos is plural."],
            ],
            "Se los precedes podemos; both pronouns stay together.",
          ],
          [
            "show-photo",
            "Keep the attached form: Estoy ___ a mi madre. (showing la foto)",
            "mostrándosela",
            [
              ["mostrando se la", "Attached pronouns are written together."],
              ["mostrándolela", "Le changes to se before la."],
              ["mostrándoselo", "Foto is feminine."],
            ],
            "Mostrándosela combines the gerund, recipient se and object la.",
          ],
          [
            "send-links",
            "Attach both pronouns: Puedo ___ esta tarde. (send los enlaces to you: tú)",
            "mandártelos",
            [
              ["mandarloste", "The recipient must precede los."],
              [
                "mandárselos",
                "Se changes the intended tú recipient to a third-person recipient.",
              ],
              ["mandártelo", "Enlaces is plural."],
            ],
            "Mandar + te + los becomes mandártelos.",
          ],
        ],
      ),
      r(
        "commands-clitics",
        "Attach in affirmative commands; precede in negatives",
        "Affirmative imperatives take attached clitics. Negative commands put the clitics before the subjunctive verb. Accents preserve the original stress.",
        "Dímelo. / No me lo digas.",
        [
          "Tráemelas. — Bring them to me.",
          "No se lo cuentes. — Do not tell him/her/them.",
        ],
        ["Do not attach clitics after a negative command."],
        [
          [
            "tell-secret",
            "Affirmative tú command: ___ . (Tell me el secreto.)",
            "Dímelo",
            [
              ["Me lo di", "A command requires attached clitics."],
              ["Dílome", "The recipient must precede lo."],
              ["Dímela", "Secreto is masculine."],
            ],
            "Di + me + lo is written dímelo.",
          ],
          [
            "dont-give-code",
            "Negative tú command: No ___ . (give el código to them)",
            "se lo des",
            [
              [
                "déselo",
                "A negative command requires clitics before the verb.",
              ],
              ["les lo des", "Les changes to se before lo."],
              ["se lo da", "Negative tú requires the subjunctive des."],
            ],
            "No se lo des places the pair before the negative-command verb.",
          ],
          [
            "bring-copies",
            "Affirmative tú command: ___ . (Bring me las copias.)",
            "Tráemelas",
            [
              [
                "Me las trae",
                "This is a statement, not the requested tú command.",
              ],
              ["Tráemelos", "Copias is feminine."],
              ["Traelasme", "Recipient must come before las."],
            ],
            "Trae + me + las becomes tráemelas.",
          ],
          [
            "dont-send-form",
            "Negative usted command: No ___ . (send la ficha to me)",
            "me la envíe",
            [
              ["envíemela", "Negative commands use pronouns before the verb."],
              ["me la envías", "Envías is an indicative tú form."],
              ["me lo envíe", "Ficha is feminine."],
            ],
            "The respectful negative command is no me la envíe.",
          ],
          [
            "show-pass",
            "Affirmative usted command: ___ . (Show us el pase.)",
            "Muéstrenoslo",
            [
              ["Nos lo muestre", "Affirmative commands attach the pronouns."],
              ["Muéstrelo nos", "The clitics must attach together."],
              ["Muéstrenosla", "Pase is masculine."],
            ],
            "Muestre + nos + lo is written muéstrenoslo.",
          ],
          [
            "dont-read-letter",
            "Negative tú command: No ___ . (read la carta to her)",
            "se la leas",
            [
              [
                "léesela",
                "Attached pronouns do not follow a negative command.",
              ],
              ["le la leas", "Le becomes se before la."],
              ["se la lee", "The negative tú command requires leas."],
            ],
            "No se la leas uses se before la and both before leas.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-prepositions",
    "Por, para and other prepositions",
    "B1",
    S4,
    "Prepositions show relationships such as cause, destination, means and time. Translate the relationship in context rather than assigning one English word to each preposition.",
    [
      r(
        "por-cause-means",
        "Use por for cause, exchange and means",
        "Por can identify a cause, route, exchange, agent or means of communication. The intended relationship distinguishes it from para.",
        "por + cause / route / exchange / means",
        [
          "Gracias por tu paciencia. — Thank you for your patience.",
          "Lo envié por correo. — I sent it by post.",
        ],
        ["Do not use para after gracias when giving the reason for thanks."],
        [
          [
            "gratitude",
            "Gracias ___ ayudarme a mover el sofá.",
            "por",
            [
              ["para", "The help is the reason for thanks, not a purpose."],
              ["a", "Gracias does not introduce this reason with a."],
              ["desde", "Desde gives an origin, not a reason."],
            ],
            "Gracias por introduces what you are thanking someone for.",
          ],
          [
            "exchange",
            "Pagué veinte euros ___ este diccionario. (the price exchanged)",
            "por",
            [
              ["para", "The dictionary is the item exchanged for money."],
              ["desde", "Desde does not mark the object purchased."],
              ["hacia", "Hacia indicates direction, not exchange."],
            ],
            "Por links the money paid to the item obtained.",
          ],
          [
            "cause-road",
            "Cerraron la carretera ___ la nieve acumulada.",
            "por",
            [
              ["para", "The accumulated snow causes the closure."],
              ["hacia", "Hacia would indicate direction."],
              ["entre", "Entre does not introduce the cause."],
            ],
            "Por introduces the cause of the closure.",
          ],
          [
            "means-email",
            "Recibí la confirmación ___ correo electrónico. (by email)",
            "por",
            [
              ["para", "Para would indicate purpose or destination."],
              ["hacia", "Hacia indicates movement toward something."],
              ["sin", "Sin means without, the opposite of the context."],
            ],
            "Por correo electrónico names the means of communication.",
          ],
          [
            "route-park",
            "Cruzamos ___ el parque para llegar a la biblioteca. (through the park)",
            "por",
            [
              ["para", "Para would identify an intended destination or use."],
              [
                "desde",
                "Desde marks the starting point, not the route through.",
              ],
              ["sin", "Sin means without."],
            ],
            "Por marks the place traversed on the route.",
          ],
          [
            "agent",
            "El mural fue pintado ___ una artista local.",
            "por",
            [
              [
                "para",
                "Para would make the artist a beneficiary, not the painter.",
              ],
              ["hacia", "Hacia gives direction."],
              ["contra", "Contra expresses opposition."],
            ],
            "Por introduces the agent of this passive construction.",
          ],
        ],
      ),
      r(
        "para-purpose",
        "Use para for purpose, recipient and deadline",
        "Para commonly names a purpose, intended recipient or deadline. An infinitive can state a purpose when the subject remains the same.",
        "para + infinitive / intended recipient / deadline",
        [
          "Estudio para aprender. — I study in order to learn.",
          "El paquete es para usted. — The parcel is for you.",
        ],
        ["Do not confuse the goal of an action with its cause."],
        [
          [
            "purpose-glasses",
            "Necesito gafas ___ leer la letra pequeña. (in order to read)",
            "para",
            [
              ["por", "The reading is the goal here, not the cause."],
              ["desde", "Desde identifies an origin."],
              ["entre", "Entre means among or between."],
            ],
            "Para + infinitive states the purpose of the glasses.",
          ],
          [
            "recipient-parcel",
            "Este paquete es ___ mi sobrino. (He is the intended recipient.)",
            "para",
            [
              ["desde", "Desde would identify where it came from."],
              ["contra", "Contra means against."],
              ["sin", "Sin means without."],
            ],
            "Para identifies the intended recipient.",
          ],
          [
            "deadline",
            "El informe debe estar listo ___ el lunes como fecha límite.",
            "para",
            [
              ["desde", "Desde marks a starting point, not this deadline."],
              ["durante", "Durante describes duration within a period."],
              [
                "hacia",
                "Hacia gives an approximate time, not a firm deadline.",
              ],
            ],
            "Para el lunes sets the completion deadline.",
          ],
          [
            "tool",
            "Esta llave sirve ___ abrir la puerta del patio.",
            "para",
            [
              ["desde", "Desde does not introduce the function."],
              ["entre", "Entre does not introduce purpose."],
              ["hacia", "Hacia names direction, not the key’s function."],
            ],
            "Servir para + infinitive explains what a tool is used for.",
          ],
          [
            "opinion",
            "___ mí, lo más importante es escuchar. (In my opinion.)",
            "Para",
            [
              ["Desde", "Desde mí is not the intended opinion expression."],
              ["Entre", "Entre mí is not the expression for an opinion."],
              ["Contra", "Contra would indicate opposition."],
            ],
            "Para mí can introduce a personal point of view.",
          ],
          [
            "save-purpose",
            "Ahorro ___ comprar una bicicleta. (My goal is to buy it.)",
            "para",
            [
              ["hasta", "Hasta names an endpoint, not this purpose."],
              ["desde", "Desde introduces a source or start."],
              ["entre", "Entre identifies a relationship among elements."],
            ],
            "Para comprar expresses the goal of saving.",
          ],
        ],
      ),
      r(
        "place-prepositions",
        "Show position, direction and origin",
        "En describes location, a often marks a destination, and de or desde can mark origin. Fixed combinations also matter: cerca de, delante de, debajo de.",
        "estar en; ir a; venir de; cerca de",
        [
          "La taza está en la mesa. — The cup is on the table.",
          "Vamos a la estación. — We are going to the station.",
        ],
        ["Learn the full expression cerca de, rather than omitting de."],
        [
          [
            "drawer",
            "El sello está ___ el cajón, junto a los sobres.",
            "en",
            [
              ["a", "A does not express this static location."],
              ["hacia", "Hacia indicates direction."],
              [
                "de",
                "De normally marks a source or relationship, not this static location.",
              ],
            ],
            "En locates the stamp inside the drawer.",
          ],
          [
            "destination",
            "Mañana iremos ___ la oficina de correos.",
            "a",
            [
              ["en", "En does not mark this destination after iremos."],
              ["desde", "Desde would mark the starting point."],
              ["sin", "Sin means without."],
            ],
            "Ir a introduces the destination.",
          ],
          [
            "near",
            "La farmacia está cerca ___ mi casa.",
            "de",
            [
              ["a", "The expression is cerca de."],
              ["en", "Cerca en does not introduce this reference point."],
              ["para", "Cerca para is not the location expression."],
            ],
            "Cerca de links nearness to its reference point.",
          ],
          [
            "under-table",
            "El gato duerme debajo ___ la mesa.",
            "de",
            [
              ["por", "Debajo por does not form this expression."],
              ["a", "Debajo a is not the standard combination here."],
              ["hacia", "Hacia would not complete debajo."],
            ],
            "Debajo de means underneath.",
          ],
          [
            "between",
            "La panadería está ___ el banco y la librería.",
            "entre",
            [
              ["hacia", "Hacia does not express being between two places."],
              ["desde", "Desde marks an origin."],
              ["sin", "Sin means without."],
            ],
            "Entre joins two reference points for the location.",
          ],
          [
            "origin",
            "El queso viene ___ una pequeña granja. (from that farm)",
            "de",
            [
              ["a", "A would mark a destination."],
              ["contra", "Contra means against."],
              ["sin", "Sin means without."],
            ],
            "Venir de identifies the source of the cheese.",
          ],
        ],
      ),
      r(
        "time-dependent",
        "Learn time and dependent combinations",
        "Spanish uses combinations such as a las ocho, desde marzo, hasta mañana and durante la reunión. Some verbs require a particular preposition before an infinitive.",
        "a + clock time; desde + start; hasta + endpoint; depender de",
        [
          "La clase empieza a las nueve. — Class starts at nine.",
          "Depende de la fecha. — It depends on the date.",
        ],
        ["Do not translate depend on as depender en."],
        [
          [
            "clock",
            "La consulta empieza ___ las diez y media.",
            "a",
            [
              ["en", "Clock times normally take a."],
              [
                "desde",
                "Desde would give a starting span rather than the appointment time.",
              ],
              ["por", "Por does not introduce this precise clock time."],
            ],
            "A las diez y media names the appointment’s clock time.",
          ],
          [
            "since-march",
            "Vivo aquí ___ marzo, sin interrupción. (since March)",
            "desde",
            [
              ["hasta", "Hasta marks the end, not the beginning."],
              ["hacia", "Hacia expresses approximation."],
              ["para", "Para does not express since."],
            ],
            "Desde identifies when the continuing situation began.",
          ],
          [
            "until",
            "La tienda permanecerá cerrada ___ el jueves; ese día reabre.",
            "hasta",
            [
              ["desde", "Desde gives the beginning of a period."],
              ["entre", "Entre requires another boundary or plural set."],
              ["sin", "Sin means without."],
            ],
            "Hasta marks the endpoint of the closure.",
          ],
          [
            "during",
            "No uses el móvil ___ la entrevista. (during the interview)",
            "durante",
            [
              ["desde", "Desde gives a starting point."],
              ["hacia", "Hacia means toward or around."],
              ["entre", "Entre does not mean during a singular event."],
            ],
            "Durante places the prohibition within the interview period.",
          ],
          [
            "depend",
            "La salida depende ___ que llegue el permiso.",
            "de",
            [
              ["en", "Depender requires de here."],
              ["a", "Depender a is not the required combination."],
              ["por", "Depender por is not the required combination."],
            ],
            "Depender de retains de before a que-clause.",
          ],
          [
            "learn-to",
            "Estoy aprendiendo ___ conducir con una profesora.",
            "a",
            [
              ["de", "Aprender takes a before this infinitive."],
              ["por", "Por does not complete aprender here."],
              ["en", "En cannot introduce this infinitive complement."],
            ],
            "Aprender a + infinitive names the skill being learned.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-comparison-quantity",
    "Comparison and quantity",
    "B1",
    S4,
    "Compare qualities and amounts with matching structures. Some comparison words are invariable; quantity words that accompany nouns often agree.",
    [
      r(
        "comparative",
        "Build unequal comparisons",
        "Más or menos + adjective/adverb + que compares unequal qualities. Mejor and peor are irregular comparisons; do not normally add más to them.",
        "más / menos + adjective + que; mejor / peor que",
        [
          "Este puente es más largo que el otro. — This bridge is longer than the other.",
          "Hoy me siento mejor que ayer. — I feel better today than yesterday.",
        ],
        ["Do not use más mejor for the ordinary comparative."],
        [
          [
            "tram-speed",
            "El tranvía es más rápido ___ el autobús.",
            "que",
            [
              ["como", "Como belongs to tan…como, not más…que."],
              ["de", "A noun comparison here uses que."],
              ["a", "A does not complete this comparison."],
            ],
            "Más rápido que compares the speed of two forms of transport.",
          ],
          [
            "cheap-hotel",
            "Este hotel cuesta menos ___ el del centro.",
            "que",
            [
              ["como", "Menos does not pair with como here."],
              ["a", "A does not link these compared prices."],
              ["en", "En does not complete the comparison."],
            ],
            "Menos que introduces the item with the higher price.",
          ],
          [
            "quality-improved",
            "The new lens is better: Esta lente es ___ que la anterior.",
            "mejor",
            [
              ["más mejor", "Mejor already expresses the comparative."],
              ["tan mejor", "Tan cannot modify this comparative."],
              [
                "mejora",
                "Mejora is a noun or verb, not the comparative adjective.",
              ],
            ],
            "Mejor is the comparative of bueno in this quality comparison.",
          ],
          [
            "worse-weather",
            "El tiempo de hoy es ___ que el de ayer. (worse)",
            "peor",
            [
              ["más peor", "Peor already means worse."],
              ["tan peor", "Tan does not form this comparison."],
              ["peora", "Peora is not the required adjective."],
            ],
            "Peor is the irregular comparative meaning worse.",
          ],
          [
            "less-noisy",
            "We want a less noisy room: Buscamos una habitación ___ ruidosa que esta.",
            "menos",
            [
              ["tan", "Tan would require como."],
              ["mejor", "Mejor cannot directly modify ruidosa here."],
              ["cuanta", "Cuanta does not express this degree."],
            ],
            "Menos ruidosa que gives the intended lower degree of noise.",
          ],
          [
            "older-sibling",
            "My brother is older than me: Mi hermano es ___ que yo.",
            "mayor",
            [
              ["más mayor que", "The sentence already includes que."],
              ["mayores", "The subject is singular."],
              ["mayora", "Mayor has no feminine -a form."],
            ],
            "Mayor expresses the intended comparison of ages.",
          ],
        ],
      ),
      r(
        "equality",
        "Compare equal qualities and amounts",
        "Tan + adjective/adverb + como compares qualities. Tanto agrees with a noun in gender and number; as an adverb with a verb it stays tanto.",
        "tan alto como; tanta agua como; trabaja tanto como",
        [
          "Es tan ancho como la puerta. — It is as wide as the door.",
          "Tengo tantas dudas como tú. — I have as many doubts as you.",
        ],
        ["Do not put tan directly before a noun when quantifying it."],
        [
          [
            "equal-distance",
            "La estación está tan lejos ___ el puerto.",
            "como",
            [
              ["que", "Tan pairs with como."],
              ["de", "De does not close this equality structure."],
              ["a", "A does not close this comparison."],
            ],
            "Tan lejos como compares equal distances.",
          ],
          [
            "equal-time",
            "Tengo ___ tiempo libre como mi compañera.",
            "tanto",
            [
              ["tan", "Tiempo is a noun."],
              ["tanta", "Tiempo is masculine."],
              ["tantos", "Tiempo is singular here."],
            ],
            "Tanto agrees with the masculine singular noun tiempo.",
          ],
          [
            "equal-work",
            "La nueva biblioteca tiene ___ salas como la antigua.",
            "tantas",
            [
              ["tanto", "Salas is feminine plural."],
              ["tan", "Tan does not quantify a noun."],
              ["tantos", "Salas is feminine."],
            ],
            "Tantas agrees with salas.",
          ],
          [
            "equal-study",
            "Mi vecina estudia ___ como yo.",
            "tanto",
            [
              [
                "tanta",
                "As an adverb with estudia, tanto does not agree with vecina.",
              ],
              ["tantos", "No plural noun follows."],
              ["tan", "Tan needs an adjective or adverb here."],
            ],
            "With a verb alone, tanto is invariable.",
          ],
          [
            "equal-clear",
            "Tu explicación es ___ clara como la del manual.",
            "tan",
            [
              ["tanta", "Clara is an adjective, not a noun being counted."],
              ["tanto", "The adjective comparison uses tan."],
              ["tantas", "There is no plural quantity noun."],
            ],
            "Tan + adjective + como expresses equal clarity.",
          ],
          [
            "equal-books",
            "Ella ha leído ___ libros como nosotros.",
            "tantos",
            [
              ["tanto", "Libros is plural."],
              ["tantas", "Libros is masculine."],
              ["tan", "Tan cannot directly quantify libros."],
            ],
            "Tantos agrees with libros in gender and number.",
          ],
        ],
      ),
      r(
        "superlative",
        "Identify an extreme within a group",
        "A relative superlative uses a definite article with más or menos and a comparison group introduced by de. Mejor, peor, mayor and menor can also occur in this structure.",
        "el / la / los / las + más / menos + adjective + de",
        [
          "Es la calle más estrecha del barrio. — It is the narrowest street in the neighborhood.",
          "Son los mejores asientos de la sala. — They are the best seats in the room.",
        ],
        ["Use de, rather than que, to introduce the whole comparison group."],
        [
          [
            "highest-mountain",
            "Es la montaña más alta ___ la región.",
            "de",
            [
              ["que", "Que compares two items; de introduces the whole group."],
              ["como", "Como belongs to equality comparisons."],
              ["a", "A does not introduce the comparison group."],
            ],
            "De la región names the group within which the mountain is highest.",
          ],
          [
            "best-seat",
            "These are the best seats: Son ___ mejores asientos del teatro.",
            "los",
            [
              ["las", "Asientos is masculine."],
              ["el", "Asientos is plural."],
              ["la", "The noun is masculine plural."],
            ],
            "Los agrees with the masculine plural noun asientos.",
          ],
          [
            "least-expensive",
            "The least expensive option: Es la opción ___ cara de todas.",
            "menos",
            [
              ["menor", "Menor cannot directly modify cara here."],
              ["peor", "Peor would not form this degree phrase."],
              ["tan", "Tan requires como, not de todas."],
            ],
            "La menos cara identifies the lowest price in the group.",
          ],
          [
            "best-answer",
            "Es la ___ respuesta del examen. (best)",
            "mejor",
            [
              ["más mejor", "Mejor already carries comparative meaning."],
              ["mejores", "Respuesta is singular."],
              ["mejora", "Mejora is not this adjective."],
            ],
            "La mejor respuesta is the superlative using the irregular comparative.",
          ],
          [
            "longest-days",
            "Son los días más largos ___ año.",
            "del",
            [
              ["que el", "The comparison group requires de."],
              ["de el", "De + el contracts to del here."],
              ["al", "Al expresses a, not de."],
            ],
            "De el año contracts to del año.",
          ],
          [
            "quietest-room",
            "La habitación más tranquila ___ hotel está al fondo.",
            "del",
            [
              ["que el", "A group superlative uses de."],
              ["de el", "De and the article el contract here."],
              ["como el", "Como belongs to equality, not this superlative."],
            ],
            "Del hotel identifies the hotel’s rooms as the comparison group.",
          ],
        ],
      ),
      r(
        "quantity-agreement",
        "Match quantity words to nouns",
        "Mucho, poco, demasiado and suficiente can quantify nouns. Variable forms agree with the noun; muy modifies an adjective or adverb. Muy is invariable.",
        "mucho trabajo; muchas tareas; muy difícil",
        [
          "Hay demasiadas cajas. — There are too many boxes.",
          "La prueba es muy difícil. — The test is very difficult.",
        ],
        ["Do not say muy libros or mucho difícil."],
        [
          [
            "water",
            "Queda muy ___ agua en la botella. (little)",
            "poca",
            [
              ["poco", "Agua is feminine even though el agua uses el."],
              ["pocos", "Agua is singular here."],
              ["pocas", "There is no plural noun."],
            ],
            "Poca agrees with feminine singular agua.",
          ],
          [
            "many-visitors",
            "El museo recibió ___ visitantes. (many)",
            "muchos",
            [
              ["mucho", "Visitantes is plural."],
              ["muy", "Muy does not directly quantify this noun."],
              ["mucha", "The intended noun is masculine plural."],
            ],
            "Muchos agrees with the masculine plural visitantes in this context.",
          ],
          [
            "very-cold",
            "La sopa está ___ fría.",
            "muy",
            [
              ["mucho", "An adjective takes muy in this degree expression."],
              ["muchas", "No plural noun is being quantified."],
              ["muchos", "Fría is an adjective, not a counted noun."],
            ],
            "Muy modifies the adjective fría.",
          ],
          [
            "too-many-bags",
            "Llevamos ___ maletas para un coche tan pequeño. (too many)",
            "demasiadas",
            [
              ["demasiado", "Maletas is feminine plural."],
              ["demasiados", "Maletas is feminine."],
              ["demasiada", "Maletas is plural."],
            ],
            "Demasiadas agrees with maletas.",
          ],
          [
            "enough-chairs",
            "No hay ___ sillas para todos. (enough)",
            "suficientes",
            [
              ["suficiente", "Sillas is plural."],
              [
                "suficientemente",
                "This adverb cannot directly quantify sillas.",
              ],
              ["suficientas", "Suficiente does not form a feminine -a."],
            ],
            "Suficientes changes for number but not for gender.",
          ],
          [
            "few-errors",
            "El informe tiene ___ errores. (few)",
            "pocos",
            [
              ["poco", "Errores is plural."],
              ["pocas", "Errores is masculine."],
              ["muy", "Muy cannot quantify errores directly."],
            ],
            "Pocos agrees with the plural masculine noun errores.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-infinitives-periphrases",
    "Infinitives, gerunds and verbal phrases",
    "B1",
    S4,
    "Infinitives and gerunds combine with finite verbs to express ability, obligation, progress and stages of an action.",
    [
      r(
        "infinitive-complements",
        "Use infinitives after modal and impersonal patterns",
        "Poder, querer and deber take an infinitive directly. Tener que and hay que include que. In ordinary non-epistemic obligation, deber + infinitive is a clear pattern.",
        "puedo salir; quiero aprender; tengo que trabajar; hay que esperar",
        [
          "Podemos entrar. — We can go in.",
          "Hay que reservar. — It is necessary to book.",
        ],
        ["Do not conjugate the second verb after puedo."],
        [
          [
            "permission-enter",
            "¿Podemos ___ por esta puerta?",
            "entrar",
            [
              ["entramos", "The second verb must be an infinitive."],
              ["entrando", "Poder does not take this gerund complement."],
              ["entrado", "A participle does not complete podemos here."],
            ],
            "Podemos takes the infinitive entrar.",
          ],
          [
            "personal-duty",
            "Mañana tengo ___ renovar el pasaporte.",
            "que",
            [
              ["de", "Tener de is not the ordinary obligation pattern here."],
              ["a", "Tener a does not introduce this duty."],
              ["por", "Por does not complete tener here."],
            ],
            "Tener que + infinitive expresses a personal obligation.",
          ],
          [
            "general-duty",
            "En esta sala hay ___ apagar el móvil.",
            "que",
            [
              ["de", "Hay de does not form this obligation phrase."],
              ["a", "Hay a does not introduce this requirement."],
              ["en", "En does not complete the verbal phrase."],
            ],
            "Hay que expresses a general requirement without naming a subject.",
          ],
          [
            "desire-learn",
            "Quiero ___ a preparar pan.",
            "aprender",
            [
              [
                "aprendo",
                "Quiero takes an infinitive when the subject stays yo.",
              ],
              [
                "aprendiendo",
                "This gerund is not the complement of quiero here.",
              ],
              ["aprendido", "A participle cannot complete quiero here."],
            ],
            "The same person wants and learns, so use quiero aprender.",
          ],
          [
            "must-rest",
            "El médico dice que debo ___ más.",
            "descansar",
            [
              ["descanso", "Debo requires an infinitive complement."],
              ["descansando", "This gerund does not complete debo."],
              [
                "descansado",
                "A participle does not complete this modal phrase.",
              ],
            ],
            "Debo descansar expresses the recommended duty.",
          ],
          [
            "plan-travel",
            "Vamos ___ visitar el archivo mañana.",
            "a",
            [
              ["de", "Ir de does not form the future plan phrase."],
              ["que", "Vamos que does not introduce this infinitive."],
              ["en", "En does not form ir a + infinitive."],
            ],
            "Ir a + infinitive expresses the planned visit.",
          ],
        ],
      ),
      r(
        "gerund-formation",
        "Form gerunds, including irregulars",
        "Regular -ar verbs form -ando and -er/-ir verbs form -iendo. Some forms have a stem change or y: diciendo, durmiendo, leyendo, yendo.",
        "hablar → hablando; comer → comiendo; leer → leyendo",
        [
          "Estoy leyendo una novela. — I am reading a novel.",
          "El bebé está durmiendo. — The baby is sleeping.",
        ],
        ["Do not form leer as leiendo or ir as iendo."],
        [
          [
            "soup-cooking",
            "Estoy ___ una sopa para la cena. (preparar)",
            "preparando",
            [
              ["prepariendo", "-Ar verbs take -ando."],
              ["preparado", "Preparado is a participle, not the gerund."],
              ["preparar", "Estar requires the gerund for an ongoing action."],
            ],
            "Preparar forms the gerund preparando.",
          ],
          [
            "reading-sign",
            "La guía está ___ el cartel en voz alta. (leer)",
            "leyendo",
            [
              ["leiendo", "The spelling is leyendo."],
              ["leído", "Leído is the past participle."],
              ["leer", "The ongoing action requires a gerund."],
            ],
            "Leer forms leyendo with y.",
          ],
          [
            "baby-sleep",
            "Use estar + gerund: El bebé está ___ en su cuna. (dormir)",
            "durmiendo",
            [
              ["dormiendo", "Dormir changes o to u in the gerund."],
              [
                "dormido",
                "Dormido describes a state, not the requested gerund.",
              ],
              ["dormir", "An infinitive does not complete this progressive."],
            ],
            "The gerund of dormir is durmiendo.",
          ],
          [
            "telling-truth",
            "¿Estás ___ la verdad? (decir)",
            "diciendo",
            [
              ["deciendo", "The gerund stem is dic-."],
              ["dicho", "Dicho is a participle."],
              ["decir", "The progressive requires a gerund."],
            ],
            "Decir forms the irregular gerund diciendo.",
          ],
          [
            "going-clinic",
            "Estamos ___ a la clínica ahora. (ir)",
            "yendo",
            [
              ["iendo", "The gerund of ir is yendo."],
              ["ido", "Ido is a participle."],
              ["ir", "The progressive construction requires a gerund."],
            ],
            "Ir has the irregular gerund yendo.",
          ],
          [
            "asking-help",
            "La turista está ___ ayuda en recepción. (pedir)",
            "pidiendo",
            [
              ["pediendo", "Pedir changes e to i in this gerund."],
              ["pedido", "Pedido is a participle."],
              ["pedir", "The progressive needs a gerund."],
            ],
            "Pedir forms pidiendo.",
          ],
        ],
      ),
      r(
        "progress-duration",
        "Describe progress and continuing activity",
        "Estar + gerund presents an action in progress. Seguir + gerund means to continue. Llevar + duration + gerund measures how long an activity has continued.",
        "está trabajando; sigue esperando; lleva dos horas estudiando",
        [
          "Sigo buscando las llaves. — I am still looking for the keys.",
          "Llevo media hora esperando. — I have been waiting for half an hour.",
        ],
        ["Do not use an infinitive after seguir when it means continue doing."],
        [
          [
            "still-raining",
            "Todavía sigue ___; no guardes el paraguas. (llover)",
            "lloviendo",
            [
              ["llover", "Seguir takes a gerund for continuing activity."],
              [
                "llovido",
                "A participle does not express this continuing action.",
              ],
              ["llueve", "A second finite verb cannot follow sigue here."],
            ],
            "Sigue lloviendo means it is still raining.",
          ],
          [
            "duration-study",
            "Llevo tres horas ___ este documento. (revisar)",
            "revisando",
            [
              ["revisar", "This duration construction takes a gerund."],
              [
                "revisado",
                "The participle does not complete llevo + duration here.",
              ],
              ["reviso", "A second finite form cannot fill the gap."],
            ],
            "Llevar + duration + gerund describes an activity continuing up to now.",
          ],
          [
            "ongoing-writing",
            "Ahora mismo la periodista está ___ el artículo. (escribir)",
            "escribiendo",
            [
              ["escribe", "The progressive needs a gerund."],
              ["escribir", "Estar does not take this infinitive for progress."],
              [
                "escrita",
                "A feminine participle would describe a resulting state.",
              ],
            ],
            "Está escribiendo presents writing as in progress.",
          ],
          [
            "continue-learning",
            "Aunque terminé el curso, sigo ___ español. (aprender)",
            "aprendiendo",
            [
              ["aprender", "Continuing an activity uses seguir + gerund."],
              [
                "aprendido",
                "A participle cannot express the intended continuation.",
              ],
              [
                "aprendo",
                "The finite verb sigo already carries person and tense.",
              ],
            ],
            "Sigo aprendiendo means I continue to learn.",
          ],
          [
            "hours-driving",
            "La conductora lleva dos horas ___ sin parar. (conducir)",
            "conduciendo",
            [
              ["conducir", "Llevar + duration needs a gerund here."],
              [
                "conducida",
                "A participle does not describe the ongoing driving.",
              ],
              ["conduce", "A second finite verb is not licensed here."],
            ],
            "Lleva dos horas conduciendo measures the ongoing duration.",
          ],
          [
            "watching-live",
            "Estamos ___ el eclipse en directo. (ver)",
            "viendo",
            [
              ["ver", "The progressive takes a gerund."],
              ["visto", "Visto is the participle, not the gerund."],
              ["vemos", "Estamos already supplies the finite verb."],
            ],
            "Ver forms viendo in estar + gerund.",
          ],
        ],
      ),
      r(
        "action-phases",
        "Mark starting, stopping, repeating and recent completion",
        "Empezar a marks a beginning, dejar de a stopping point, volver a a repetition and acabar de a very recent completion. Each phrase keeps its preposition before an infinitive.",
        "empezar a; dejar de; volver a; acabar de + infinitive",
        [
          "Volvió a llamar. — He/she called again.",
          "Acabo de llegar. — I have just arrived.",
        ],
        ["Do not omit the preposition that belongs to the verbal phrase."],
        [
          [
            "begin-course",
            "El lunes empiezo ___ estudiar italiano.",
            "a",
            [
              ["de", "Empezar uses a before this infinitive."],
              ["en", "En does not form empezar a + infinitive."],
              ["que", "Que does not introduce the infinitive here."],
            ],
            "Empezar a + infinitive means to begin doing something.",
          ],
          [
            "quit-smoking",
            "Dejó ___ fumar el año pasado.",
            "de",
            [
              ["a", "Dejar de means stop doing."],
              ["en", "En does not complete this phase expression."],
              ["que", "Que would require a different clause structure."],
            ],
            "Dejar de + infinitive marks the end of a habit.",
          ],
          [
            "call-again",
            "No contestaron, así que volví ___ llamar.",
            "a",
            [
              ["de", "Volver a expresses repetition."],
              ["que", "Que cannot introduce this infinitive."],
              ["en", "En does not form the repetition phrase."],
            ],
            "Volver a llamar means to call again.",
          ],
          [
            "just-arrived",
            "Acabo ___ llegar; todavía llevo el abrigo.",
            "de",
            [
              ["a", "Acabar de marks recent completion."],
              ["que", "Que does not introduce this infinitive."],
              ["en", "En does not form the intended phrase."],
            ],
            "Acabo de llegar means I have just arrived.",
          ],
          [
            "stop-rain",
            "Por fin ha dejado ___ llover.",
            "de",
            [
              ["a", "Dejar a has a different construction."],
              ["que", "Que cannot introduce llover here."],
              ["por", "Por does not complete this phase meaning."],
            ],
            "Dejar de llover marks the end of the rain.",
          ],
          [
            "repeat-explanation",
            "La profesora tuvo que volver ___ explicar el problema.",
            "a",
            [
              ["de", "The repetition expression is volver a."],
              ["que", "A second que does not introduce the infinitive here."],
              ["en", "En does not form the required verbal phrase."],
            ],
            "Volver a explicar means to explain again.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-present-subjunctive",
    "Forming the present subjunctive",
    "B1",
    S5,
    "The subjunctive is a mood used in selected dependent clauses and commands. First learn its present-tense forms; the following chapters explain when those forms are needed.",
    [
      r(
        "subj-ar",
        "Form regular -ar subjunctives",
        "Regular -ar verbs use -e, -es, -e, -emos, -éis, -en in the present subjunctive. These endings differ from the present indicative.",
        "hablar → hable, hables, hable, hablemos, habléis, hablen",
        [
          "Espero que descanses. — I hope you rest.",
          "Es mejor que caminemos. — It is better for us to walk.",
        ],
        ["Do not keep the indicative -as ending in the tú subjunctive."],
        [
          [
            "rest-tonight",
            "Use the present subjunctive: Espero que tú ___ bien esta noche. (descansar)",
            "descanses",
            [
              ["descansas", "Descansas is indicative."],
              ["descansáis", "Descansáis is a vosotros indicative."],
              [
                "descansar",
                "An infinitive cannot follow the explicit subject here.",
              ],
            ],
            "The tú present subjunctive of descansar is descanses.",
          ],
          [
            "walk-together",
            "Use the present subjunctive: Es mejor que nosotros ___ juntos. (caminar)",
            "caminemos",
            [
              ["caminamos", "Caminamos is not the present subjunctive."],
              ["caminen", "Caminen is third-person plural."],
              ["caminar", "The clause needs a finite verb."],
            ],
            "The nosotros present subjunctive takes -emos: caminemos.",
          ],
          [
            "reserve-table",
            "Use the present subjunctive: Quieren que yo ___ una mesa. (reservar)",
            "reserve",
            [
              ["reservo", "Reservo is present indicative."],
              ["reservas", "Reservas is tú indicative."],
              ["reservando", "A gerund cannot supply the finite clause verb."],
            ],
            "Reserve is the yo present subjunctive of reservar.",
          ],
          [
            "wait-outside",
            "Use the present subjunctive: Pido que ustedes ___ fuera. (esperar)",
            "esperen",
            [
              ["esperan", "Esperan is present indicative."],
              ["esperemos", "Esperemos means we."],
              ["esperar", "The clause needs a conjugated verb."],
            ],
            "Ustedes takes the third-person plural subjunctive esperen.",
          ],
          [
            "listen-guide",
            "Use the present subjunctive: Es importante que ella ___ a la guía. (escuchar)",
            "escuche",
            [
              [
                "escucha",
                "Escucha is indicative or an affirmative tú command.",
              ],
              ["escuches", "Escuches refers to tú."],
              ["escuchamos", "Escuchamos refers to nosotros."],
            ],
            "Ella takes escuche in the present subjunctive.",
          ],
          [
            "study-spain",
            "Use the present subjunctive with vosotros: Espero que ___ el mapa. (estudiar)",
            "estudiéis",
            [
              ["estudiáis", "Estudiáis is present indicative."],
              ["estudien", "Estudien corresponds to ellos/ustedes."],
              ["estudiemos", "Estudiemos corresponds to nosotros."],
            ],
            "Vosotros uses -éis for regular -ar present subjunctives.",
          ],
        ],
      ),
      r(
        "subj-er-ir",
        "Form regular -er and -ir subjunctives",
        "Regular -er and -ir verbs share -a, -as, -a, -amos, -áis, -an in the present subjunctive.",
        "comer → coma; vivir → viva; aprender → aprendamos",
        [
          "Quiero que aprendas. — I want you to learn.",
          "Ojalá reciban la carta. — I hope they receive the letter.",
        ],
        ["Do not use indicative -en where the subjunctive needs -an."],
        [
          [
            "eat-before",
            "Use the present subjunctive: Es mejor que tú ___ antes de salir. (comer)",
            "comas",
            [
              ["comes", "Comes is indicative."],
              ["coma", "Coma is not the tú form."],
              ["coméis", "Coméis is vosotros indicative."],
            ],
            "The tú present subjunctive of comer is comas.",
          ],
          [
            "live-nearby",
            "Use the present subjunctive: Espero que ellas ___ cerca. (vivir)",
            "vivan",
            [
              ["viven", "Viven is indicative."],
              ["vivamos", "Vivamos is nosotros."],
              ["vivís", "Vivís is vosotros indicative."],
            ],
            "Ellas takes vivan.",
          ],
          [
            "learn-method",
            "Use the present subjunctive: Conviene que nosotros ___ el método. (aprender)",
            "aprendamos",
            [
              ["aprendemos", "Aprendemos is indicative."],
              ["aprendan", "Aprendan is third-person plural."],
              ["aprender", "An infinitive cannot complete this finite clause."],
            ],
            "The nosotros present subjunctive is aprendamos.",
          ],
          [
            "open-envelope",
            "Use the present subjunctive: Piden que yo ___ el sobre. (abrir)",
            "abra",
            [
              ["abro", "Abro is indicative."],
              ["abres", "Abres is tú indicative."],
              ["abriendo", "The gerund cannot be the finite verb here."],
            ],
            "Abra is the yo present subjunctive.",
          ],
          [
            "receive-mail",
            "Use the present subjunctive: Ojalá ustedes ___ noticias pronto. (recibir)",
            "reciban",
            [
              ["reciben", "Reciben is indicative."],
              ["recibas", "Recibas is tú."],
              ["recibimos", "Recibimos is not the present subjunctive."],
            ],
            "Ustedes takes reciban.",
          ],
          [
            "drink-water",
            "Use the present subjunctive with vosotros: Recomiendo que ___ agua. (beber)",
            "bebáis",
            [
              ["bebéis", "Bebéis is indicative."],
              ["beban", "Beban is ellos/ustedes."],
              ["bebamos", "Bebamos is nosotros."],
            ],
            "Vosotros uses bebáis in the present subjunctive.",
          ],
        ],
      ),
      r(
        "subj-stem-spelling",
        "Preserve stems and spelling changes",
        "Many present subjunctives use the yo indicative stem. Spelling changes preserve sound: buscar → busque, llegar → llegue. Stem-changing -ir verbs can also change in nosotros: pedir → pidamos, dormir → durmamos.",
        "tengo → tenga; busco → busque; pido → pida / pidamos",
        [
          "Quiero que busques otra solución. — I want you to look for another solution.",
          "Es mejor que durmamos. — It is better for us to sleep.",
        ],
        ["Nosotros forms of -ir stem-changers need special attention."],
        [
          [
            "search-solution",
            "Use the present subjunctive: Espero que tú ___ otra solución. (buscar)",
            "busques",
            [
              ["busces", "Qu preserves the /k/ sound before e."],
              ["buscas", "Buscas is indicative."],
              ["busquemos", "Busquemos is nosotros."],
            ],
            "Buscar changes c to qu before the subjunctive e.",
          ],
          [
            "arrive-safely",
            "Use the present subjunctive: Ojalá ella ___ sin problemas. (llegar)",
            "llegue",
            [
              ["llege", "Gu preserves the hard g sound before e."],
              ["llega", "Llega is indicative."],
              ["llegues", "Llegues refers to tú."],
            ],
            "Llegar forms llegue to preserve its sound.",
          ],
          [
            "ask-receipt",
            "Use the present subjunctive: Conviene que nosotros ___ un recibo. (pedir)",
            "pidamos",
            [
              ["pedamos", "Pedir changes e to i in this form."],
              ["pedimos", "Pedimos is indicative."],
              ["pidan", "Pidan is third-person plural."],
            ],
            "The nosotros present subjunctive of pedir is pidamos.",
          ],
          [
            "sleep-well",
            "Use the present subjunctive: Es importante que nosotros ___ bien. (dormir)",
            "durmamos",
            [
              ["dormamos", "Dormir changes o to u in this form."],
              ["dormimos", "Dormimos is indicative."],
              ["duerman", "Duerman is third-person plural."],
            ],
            "Dormir uses durmamos for nosotros.",
          ],
          [
            "have-time",
            "Use the present subjunctive: Espero que ustedes ___ tiempo. (tener)",
            "tengan",
            [
              ["tenen", "This is not a conjugated form of tener."],
              ["tienen", "Tienen is indicative."],
              ["tengamos", "Tengamos is nosotros."],
            ],
            "The teng- stem appears in tengan.",
          ],
          [
            "close-door",
            "Use the present subjunctive: Quiero que tú ___ la puerta. (cerrar)",
            "cierres",
            [
              ["cerres", "The stressed stem changes e to ie."],
              ["cierras", "Cierras is indicative."],
              ["cierren", "Cierren is plural third person."],
            ],
            "Cerrar forms cierres for tú in the present subjunctive.",
          ],
        ],
      ),
      r(
        "subj-irregular",
        "Learn the core irregular forms",
        "Ser, ir, haber, saber, estar and dar have important irregular present subjunctives: sea, vaya, haya, sepa, esté and dé. The accents in esté and dé distinguish forms and stress.",
        "sea; vaya; haya; sepa; esté; dé",
        [
          "Espero que sea fácil. — I hope it is easy.",
          "Ojalá haya sitio. — I hope there is room.",
        ],
        ["Existential haya stays singular even before a plural noun."],
        [
          [
            "be-useful",
            "Use the present subjunctive: Espero que el manual ___ útil. (ser)",
            "sea",
            [
              ["es", "Es is indicative."],
              ["soy", "Soy is yo indicative."],
              ["sean", "The subject el manual is singular."],
            ],
            "Ser forms sea for a singular third-person subject.",
          ],
          [
            "go-office",
            "Use the present subjunctive: Quieren que yo ___ a la oficina. (ir)",
            "vaya",
            [
              ["voy", "Voy is indicative."],
              ["va", "Va is third-person indicative."],
              ["vayamos", "Vayamos means we."],
            ],
            "The yo present subjunctive of ir is vaya.",
          ],
          [
            "seats-exist",
            "Use the present subjunctive: Ojalá ___ asientos libres. (existential haber)",
            "haya",
            [
              ["hayan", "Existential haber remains singular."],
              ["hay", "Hay is indicative."],
              ["ha", "Ha alone is a perfect-tense auxiliary."],
            ],
            "Existential haber is impersonal: haya asientos.",
          ],
          [
            "know-answer",
            "Use the present subjunctive: Espero que tú ___ la respuesta. (saber)",
            "sepas",
            [
              ["sabes", "Sabes is indicative."],
              ["sabo", "Sabo is not a standard form."],
              ["sepan", "Sepan is plural third person."],
            ],
            "The tú present subjunctive is sepas.",
          ],
          [
            "ready-parcel",
            "Use the present subjunctive: Necesito que el paquete ___ listo. (estar)",
            "esté",
            [
              ["está", "Está is indicative."],
              ["este", "The verb requires an accent in esté."],
              ["estén", "Paquete is singular."],
            ],
            "Esté is the accented third-person present subjunctive of estar.",
          ],
          [
            "give-reply",
            "Use the present subjunctive: Quiero que ella me ___ una respuesta. (dar)",
            "dé",
            [
              ["de", "The verb form dé requires an accent."],
              ["da", "Da is indicative."],
              ["den", "Den is plural third person."],
            ],
            "Dar forms dé for ella in the present subjunctive.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-wishes-evaluation",
    "Wishes, feelings and evaluation",
    "B1",
    S5,
    "Spanish often uses the subjunctive when one person influences another, reacts emotionally to an event or evaluates what should happen. An infinitive is common when the subject stays the same.",
    [
      r(
        "wishes-influence",
        "Express wishes and influence",
        "Querer que, pedir que and recomendar que introduce subjunctive clauses when they concern another subject. The main verb expresses a wish or influence rather than reporting a fact.",
        "quiero / pido / recomiendo + que + subjunctive",
        [
          "Quiero que vengas. — I want you to come.",
          "Recomiendo que reserve. — I recommend that he/she book.",
        ],
        ["Do not copy English want someone to as querer alguien a."],
        [
          [
            "window-wish",
            "Quiero que tú ___ la ventana ahora. (cerrar)",
            "cierres",
            [
              [
                "cierras",
                "A wish about another subject calls for the subjunctive.",
              ],
              ["cerrar", "The explicit tú clause needs a finite verb."],
              ["cerrando", "A gerund cannot be its finite verb."],
            ],
            "Quiero que introduces the desired action by tú: cierres.",
          ],
          [
            "boss-request",
            "La jefa pide que nosotros ___ el presupuesto hoy. (revisar)",
            "revisemos",
            [
              ["revisamos", "The request calls for a subjunctive clause."],
              ["revisar", "The clause has its own subject."],
              ["revisen", "Revisen does not agree with nosotros."],
            ],
            "Pedir que + another subject takes revisemos here.",
          ],
          [
            "hotel-advice",
            "Te recomiendo que ___ una habitación con antelación. (reservar)",
            "reserves",
            [
              ["reservas", "The recommendation calls for the subjunctive."],
              ["reservar", "Que introduces a finite clause here."],
              ["reserven", "Reserven does not refer to tú."],
            ],
            "The recommended action is expressed by reserves.",
          ],
          [
            "children-wish",
            "Mis padres quieren que yo ___ más a menudo. (escribir)",
            "escriba",
            [
              [
                "escribo",
                "Escribo reports a fact rather than fitting this wish clause.",
              ],
              ["escribes", "Escribes is tú indicative."],
              ["escribiendo", "The clause needs a finite verb."],
            ],
            "Quieren que yo requires the subjunctive escriba.",
          ],
          [
            "permission-request",
            "Pido que ustedes ___ mi solicitud. (considerar)",
            "consideren",
            [
              ["consideran", "This request takes the subjunctive."],
              ["consideres", "Consideres addresses tú."],
              ["considerando", "A gerund cannot complete the clause."],
            ],
            "The request about ustedes uses consideren.",
          ],
          [
            "shared-desire",
            "Ella desea que nosotros ___ el proyecto. (terminar)",
            "terminemos",
            [
              [
                "terminamos",
                "The desired event is expressed with the subjunctive.",
              ],
              ["terminen", "Terminen is third-person plural."],
              ["terminar", "The explicit subject needs a finite form."],
            ],
            "Desea que nosotros takes terminemos.",
          ],
        ],
      ),
      r(
        "emotional-reaction",
        "React to events",
        "Alegrarse de que, sentir que in its regret sense and dar pena que can introduce subjunctive clauses. Emotional evaluation does not mean the event is untrue: a known fact can still be in the subjunctive.",
        "me alegra / me da pena / siento + que + subjunctive",
        [
          "Me alegra que estés aquí. — I am glad you are here.",
          "Siento que no puedas venir. — I am sorry you cannot come.",
        ],
        ["Subjunctive is not simply a synonym for unreal."],
        [
          [
            "glad-visit",
            "Me alegra que tú ___ aquí hoy. (estar)",
            "estés",
            [
              ["estás", "The emotional reaction calls for subjunctive."],
              ["estar", "The clause has an explicit subject."],
              ["estén", "Estén is plural third person."],
            ],
            "Me alegra que selects estés even when the visit is real.",
          ],
          [
            "regret-cancel",
            "I am sorry you cannot attend: Siento que no ___ venir. (poder, tú)",
            "puedas",
            [
              ["puedes", "Regret with siento que takes the subjunctive here."],
              ["poder", "The clause needs a finite verb."],
              ["puedan", "Puedan refers to ellos/ustedes."],
            ],
            "Siento expresses regret, so the clause uses puedas.",
          ],
          [
            "sad-closure",
            "Nos da pena que la biblioteca ___ tan pronto. (cerrar)",
            "cierre",
            [
              ["cierra", "The emotional judgement selects subjunctive."],
              ["cierres", "The subject is la biblioteca, not tú."],
              ["cerrando", "A gerund is not the required finite form."],
            ],
            "The singular library takes cierre after nos da pena que.",
          ],
          [
            "happy-learning",
            "Me alegro de que ustedes ___ a gusto en el curso. (estar)",
            "estén",
            [
              ["están", "Alegrarse de que selects subjunctive here."],
              ["esté", "Ustedes is plural."],
              ["estar", "A finite clause follows que."],
            ],
            "Me alegro de que introduces the emotional reaction; estén agrees with ustedes.",
          ],
          [
            "surprise-knowledge",
            "Me sorprende que él ___ tantos idiomas. (saber)",
            "sepa",
            [
              ["sabe", "The reaction selects the subjunctive."],
              ["sepas", "Sepas addresses tú."],
              ["sabiendo", "The clause needs a finite verb."],
            ],
            "Me sorprende que takes sepa for él.",
          ],
          [
            "fear-loss",
            "Me preocupa que nosotros ___ el tren. (perder)",
            "perdamos",
            [
              ["perdemos", "The concern calls for a subjunctive clause."],
              ["pierdan", "Pierdan is third-person plural."],
              ["perder", "The explicit subject needs a conjugated form."],
            ],
            "Perdamos is the nosotros subjunctive after me preocupa que.",
          ],
        ],
      ),
      r(
        "impersonal-evaluation",
        "Evaluate what should happen",
        "Es necesario que, es importante que and es mejor que normally take the subjunctive. They differ from factual assertions such as es cierto que.",
        "es necesario / importante / mejor + que + subjunctive",
        [
          "Es necesario que firmes. — You need to sign.",
          "Es mejor que esperemos. — It is better for us to wait.",
        ],
        ["Do not assume every es…que phrase takes the same mood."],
        [
          [
            "sign-form",
            "Es necesario que usted ___ aquí. (firmar)",
            "firme",
            [
              ["firma", "This necessity judgement calls for subjunctive."],
              ["firmes", "Firmes refers to tú."],
              ["firmando", "A gerund cannot complete the clause."],
            ],
            "Usted takes firme after es necesario que.",
          ],
          [
            "arrive-early",
            "Es importante que todos ___ temprano. (llegar)",
            "lleguen",
            [
              ["llegan", "The evaluation selects subjunctive."],
              ["llegue", "Todos is plural."],
              ["llegen", "The spelling must preserve the hard g with gu."],
            ],
            "Todos takes lleguen, with gu before e.",
          ],
          [
            "wait-result",
            "Es mejor que nosotros ___ el resultado. (esperar)",
            "esperemos",
            [
              ["esperamos", "This evaluation calls for subjunctive."],
              ["esperen", "Esperen is third-person plural."],
              ["esperar", "The explicit subject needs a finite form."],
            ],
            "Es mejor que nosotros selects esperemos.",
          ],
          [
            "keep-receipts",
            "Conviene que tú ___ los recibos. (guardar)",
            "guardes",
            [
              ["guardas", "Conviene que introduces a recommended action."],
              ["guarden", "Guarden is plural third person."],
              [
                "guardando",
                "A gerund cannot serve as the clause’s finite verb.",
              ],
            ],
            "Conviene que tú uses guardes.",
          ],
          [
            "read-instructions",
            "Es fundamental que los usuarios ___ las instrucciones. (leer)",
            "lean",
            [
              ["leen", "The evaluation selects subjunctive."],
              ["lea", "Usuarios is plural."],
              ["leyendo", "A gerund alone cannot complete the clause."],
            ],
            "Lean is the plural present subjunctive of leer.",
          ],
          [
            "tell-truth",
            "Es preferible que ella ___ la verdad. (decir)",
            "diga",
            [
              ["dice", "The evaluation selects subjunctive."],
              ["digas", "Digas refers to tú."],
              ["diciendo", "The clause requires a finite verb."],
            ],
            "Es preferible que ella takes diga.",
          ],
        ],
      ),
      r(
        "same-subject-infinitive",
        "Use an infinitive for a shared subject or general action",
        "When the same person wants and acts, querer + infinitive is the normal compact pattern. A general evaluation without a named subject can also take an infinitive: es importante descansar.",
        "quiero + infinitive; me alegro de + infinitive; es importante + infinitive",
        [
          "Quiero descansar. — I want to rest.",
          "Es importante beber agua. — Drinking water is important.",
        ],
        ["Do not put a conjugated verb directly after quiero without que."],
        [
          [
            "own-wish",
            "I want to travel myself: Quiero ___ por Chile.",
            "viajar",
            [
              ["viajo", "A finite clause would require que."],
              ["viaje", "A subjunctive clause would require que."],
              ["viajando", "Querer does not take this gerund complement."],
            ],
            "One person both wants and travels: quiero viajar.",
          ],
          [
            "general-hydration",
            "General advice: Es importante ___ agua.",
            "beber",
            [
              ["bebes", "A finite subject clause needs que."],
              ["bebas", "A subjunctive clause needs que."],
              [
                "bebiendo",
                "The general action is expressed with an infinitive.",
              ],
            ],
            "An infinitive names the general action without an explicit subject.",
          ],
          [
            "own-feeling",
            "I am pleased to participate myself: Me alegro de ___ en el taller.",
            "participar",
            [
              ["participo", "A finite clause after de needs que."],
              ["participe", "The finite subjunctive would need que."],
              ["participando", "De is followed by the infinitive here."],
            ],
            "Me alegro de participar keeps the same subject.",
          ],
          [
            "own-preference",
            "Prefiero ___ antes de comprar el billete. (I prefer to wait.)",
            "esperar",
            [
              [
                "espero",
                "The finite alternative would need que and a different construction.",
              ],
              ["espere", "A finite clause cannot follow prefiero directly."],
              ["esperando", "This gerund does not complete prefiero."],
            ],
            "The same person prefers and waits, so use an infinitive.",
          ],
          [
            "general-booking",
            "General requirement: Es necesario ___ con antelación.",
            "reservar",
            [
              ["reservas", "A finite clause needs que."],
              ["reserven", "A finite subjunctive clause needs que."],
              ["reservando", "This general subject action is an infinitive."],
            ],
            "Es necesario reservar gives an impersonal requirement.",
          ],
          [
            "own-regret",
            "I regret arriving late myself: Siento ___ tarde.",
            "llegar",
            [
              ["llego", "A finite clause would require que."],
              [
                "llegue",
                "The finite subjunctive cannot follow siento directly.",
              ],
              ["llegando", "This gerund is not the complement of siento."],
            ],
            "Siento llegar tarde has one shared subject.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-doubt-purpose-referents",
    "Doubt, purpose and unknown referents",
    "B2",
    S5,
    "Mood signals how a speaker presents information. Doubt, a purpose that is to be achieved and a sought or nonexistent referent often call for the subjunctive.",
    [
      r(
        "doubt-denial",
        "Use the subjunctive in doubt and denial",
        "Dudar que and no creer que commonly introduce the subjunctive when the speaker withholds belief. Affirmative creer que ordinarily reports a belief with the indicative.",
        "dudo que / no creo que + subjunctive",
        [
          "Dudo que sea suficiente. — I doubt it is enough.",
          "No creo que tengan la llave. — I do not think they have the key.",
        ],
        [
          "A negative main verb does not automatically select subjunctive in every construction; learn the pattern and meaning.",
        ],
        [
          [
            "enough-funds",
            "I doubt the amount is sufficient: Dudo que esta cantidad ___ suficiente.",
            "sea",
            [
              [
                "es",
                "Dudar que withholds belief and selects subjunctive here.",
              ],
              ["ser", "The clause needs a finite verb."],
              ["sean", "Cantidad is singular."],
            ],
            "Dudo que introduces the doubted proposition with sea.",
          ],
          [
            "office-open",
            "I do not believe it is open now: No creo que la oficina ___ abierta.",
            "esté",
            [
              ["está", "This withheld belief uses the subjunctive."],
              ["estar", "The clause needs a finite form."],
              ["estén", "Oficina is singular."],
            ],
            "No creo que, with the stated lack of belief, takes esté.",
          ],
          [
            "enough-time",
            "We doubt you have enough time: Dudamos que tú ___ tiempo.",
            "tengas",
            [
              ["tienes", "The doubted proposition takes subjunctive."],
              ["tengan", "Tengan is plural third person."],
              ["tener", "The explicit subject requires a finite verb."],
            ],
            "Tengas agrees with tú in this doubt clause.",
          ],
          [
            "true-claim",
            "No es cierto que el servicio ___ gratuito.",
            "sea",
            [
              ["es", "The denial of truth selects subjunctive here."],
              ["ser", "A finite clause follows que."],
              ["sean", "Servicio is singular."],
            ],
            "No es cierto que denies the claim and takes sea.",
          ],
          [
            "come-doubt",
            "I doubt they will come tomorrow: Dudo que ellas ___ mañana.",
            "vengan",
            [
              ["vienen", "The stated doubt calls for subjunctive."],
              ["venimos", "Venimos refers to nosotros."],
              ["venir", "The explicit subject needs a finite form."],
            ],
            "Vengan is the present subjunctive used for this future possibility.",
          ],
          [
            "route-belief",
            "I do not think we know the route: No creo que nosotros ___ el camino.",
            "sepamos",
            [
              ["sabemos", "The stated lack of belief takes subjunctive."],
              ["sepan", "Sepan refers to ellos/ustedes."],
              ["saber", "The explicit subject requires a finite form."],
            ],
            "Sepamos is the nosotros subjunctive after no creo que.",
          ],
        ],
      ),
      r(
        "purpose-clauses",
        "Express purpose with para que",
        "Para que introduces an intended outcome, normally with a different subject, and takes the subjunctive. Para + infinitive commonly expresses a goal with the same subject.",
        "para + infinitive; para que + subjunctive",
        [
          "Te lo explico para que lo entiendas. — I explain it so you understand.",
          "Salgo pronto para evitar el tráfico. — I leave early to avoid traffic.",
        ],
        [
          "Do not put an indicative verb after para que for an intended outcome.",
        ],
        [
          [
            "understand-map",
            "Te envío el plano para que ___ la entrada. (encontrar, tú)",
            "encuentres",
            [
              ["encuentras", "Purpose with para que takes subjunctive."],
              ["encontrar", "Que introduces a finite clause."],
              ["encuentren", "The intended subject is tú."],
            ],
            "The goal is your finding the entrance, so use encuentres.",
          ],
          [
            "children-sleep",
            "Bajamos la música para que los niños ___ dormir.",
            "puedan",
            [
              ["pueden", "The intended outcome takes subjunctive."],
              ["pueda", "Niños is plural."],
              ["poder", "A finite verb is needed before dormir."],
            ],
            "Para que los niños puedan expresses the desired result.",
          ],
          [
            "read-label",
            "He ampliado la letra para que usted la ___ mejor. (leer)",
            "lea",
            [
              ["lee", "Purpose selects the subjunctive."],
              ["leas", "Leas addresses tú."],
              ["leyendo", "A gerund cannot be the finite verb."],
            ],
            "Usted takes lea in the purpose clause.",
          ],
          [
            "everyone-hear",
            "Usa el micrófono para que todos te ___ . (oír)",
            "oigan",
            [
              ["oyen", "The purpose clause takes subjunctive."],
              ["oiga", "Todos is plural."],
              ["oyendo", "The clause needs a finite verb."],
            ],
            "Oigan is the plural subjunctive of oír.",
          ],
          [
            "group-practice",
            "La tutora dejó ejemplos para que nosotros ___ . (practicar)",
            "practiquemos",
            [
              [
                "practicamos",
                "Para que requires subjunctive for this purpose.",
              ],
              ["practicemos", "Qu preserves the /k/ sound before e."],
              ["practiquen", "The subject is nosotros."],
            ],
            "Practicar forms practiquemos in the nosotros present subjunctive.",
          ],
          [
            "purpose-link",
            "I open the window so you can see: Abro la ventana ___ veas el jardín.",
            "para que",
            [
              ["para", "A finite verb needs que in this purpose clause."],
              ["por", "Por cannot introduce this finite purpose clause alone."],
              ["para de", "Para de does not introduce a purpose clause."],
            ],
            "Para que links the action to the intended outcome expressed by veas.",
          ],
        ],
      ),
      r(
        "unknown-referent",
        "Describe a sought or nonexistent referent",
        "A relative clause often takes the subjunctive when the speaker seeks a person or thing without asserting that a matching one exists. A known, identified referent normally takes the indicative.",
        "busco / necesito + an unidentified noun + que + subjunctive",
        [
          "Busco un piso que tenga ascensor. — I seek a flat with a lift.",
          "No hay nadie que conozca la clave. — Nobody knows the code.",
        ],
        [
          "Busco does not force subjunctive if the person sought is already identified; the speaker’s meaning matters.",
        ],
        [
          [
            "unknown-flat",
            "No flat is identified yet: Busco un piso que ___ ascensor.",
            "tenga",
            [
              [
                "tiene",
                "The context does not assert an identified existing flat.",
              ],
              ["tener", "A relative clause needs a finite verb."],
              ["tengan", "Piso is singular."],
            ],
            "Tenga describes a required feature of an unidentified flat.",
          ],
          [
            "no-keyholder",
            "No hay nadie que ___ la clave.",
            "sepa",
            [
              ["sabe", "The referent is explicitly nonexistent."],
              ["sepas", "Nadie is third-person singular."],
              ["saber", "A finite verb is needed after que."],
            ],
            "No hay nadie que selects sepa for a nonexistent knower.",
          ],
          [
            "needed-translator",
            "No candidate is identified: Necesitamos alguien que ___ islandés.",
            "hable",
            [
              [
                "habla",
                "This sought, unidentified person is not asserted to exist.",
              ],
              ["hablas", "Alguien is third-person singular."],
              ["hablar", "The relative clause needs a finite verb."],
            ],
            "Hable states the sought ability without identifying a known person.",
          ],
          [
            "no-shop",
            "No existe una tienda que ___ abierta toda la noche aquí.",
            "esté",
            [
              ["está", "The sentence denies the existence of such a shop."],
              ["estén", "Tienda is singular."],
              ["estar", "The relative clause needs a finite verb."],
            ],
            "Esté describes the nonexistent shop within the negative statement.",
          ],
          [
            "any-route",
            "We have not found one: Necesitamos una ruta que ___ segura.",
            "sea",
            [
              ["es", "The context presents an unidentified required route."],
              ["sean", "Ruta is singular."],
              ["ser", "The relative clause needs a finite verb."],
            ],
            "Sea describes the required quality of a route not yet identified.",
          ],
          [
            "unknown-guide",
            "No suitable guide is known: Busco una guía que ___ llevarnos al glaciar.",
            "pueda",
            [
              ["puede", "The guide is sought and unidentified."],
              ["puedan", "Una guía is singular."],
              ["poder", "A finite verb is needed before llevarnos."],
            ],
            "Pueda expresses the required ability of the unknown guide.",
          ],
        ],
      ),
      r(
        "asserted-facts",
        "Use the indicative for asserted facts",
        "Affirmative statements of belief, knowledge and certainty commonly use indicative clauses. A relative describing an identified person or thing also commonly uses the indicative.",
        "sé / creo / es cierto + que + indicative; known noun + que + indicative",
        [
          "Sé que vive aquí. — I know he/she lives here.",
          "Tengo un piso que tiene ascensor. — I have a flat with a lift.",
        ],
        ["Do not use subjunctive just because a clause starts with que."],
        [
          [
            "known-address",
            "I assert what I know: Sé que Ana ___ en esta calle.",
            "vive",
            [
              ["viva", "The clause reports an asserted fact."],
              ["vivir", "A finite verb is needed."],
              ["viven", "Ana is singular."],
            ],
            "Sé que presents the information as known, so use vive.",
          ],
          [
            "belief-train",
            "I state my belief: Creo que el tren ___ a las seis.",
            "sale",
            [
              [
                "salga",
                "Affirmative creo que normally uses indicative for the believed fact.",
              ],
              ["salir", "The clause needs a finite verb."],
              ["salen", "Tren is singular."],
            ],
            "Sale presents the departure as the speaker’s belief.",
          ],
          [
            "certain-open",
            "Es cierto que la exposición ___ mañana. (abrir)",
            "abre",
            [
              ["abra", "Es cierto que asserts truth here."],
              ["abran", "Exposición is singular."],
              ["abrir", "A finite clause follows que."],
            ],
            "The certainty expression takes the indicative abre.",
          ],
          [
            "known-doctor",
            "I identify a particular doctor I know: Conozco a una médica que ___ japonés.",
            "habla",
            [
              ["hable", "The context describes a known identified person."],
              ["hablas", "Médica is third-person singular."],
              ["hablar", "The relative clause needs a finite verb."],
            ],
            "Habla describes a fact about the known doctor.",
          ],
          [
            "owned-flat",
            "I describe my existing flat: Tengo un piso que ___ terraza.",
            "tiene",
            [
              ["tenga", "The flat is identified as one I own."],
              ["tienen", "Piso is singular."],
              ["tener", "The relative clause needs a finite verb."],
            ],
            "Tiene describes a factual feature of an identified flat.",
          ],
          [
            "certain-price",
            "Está claro que estos billetes ___ más caros. (ser)",
            "son",
            [
              ["sean", "The speaker asserts a clear fact."],
              ["es", "Billetes is plural."],
              ["ser", "A finite verb is required."],
            ],
            "Está claro que introduces the assertion son más caros.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-commands",
    "Giving instructions and commands",
    "B1",
    S5,
    "Command forms depend on the person addressed and on whether the instruction is positive or negative. This chapter names tú, usted, ustedes or vosotros so regional address choices are clear.",
    [
      r(
        "affirmative-tu",
        "Give affirmative tú commands",
        "Regular affirmative tú commands usually match the third-person singular present indicative. Key irregulars include di, haz, ve, pon, sal, sé, ten and ven.",
        "habla; come; abre; di; haz; ven",
        ["Abre la puerta. — Open the door.", "Ven conmigo. — Come with me."],
        ["Do not use the infinitive as the ordinary written tú command."],
        [
          [
            "open-door",
            "Affirmative tú instruction: ___ la puerta con cuidado. (abrir)",
            "Abre",
            [
              ["Abres", "Abres is a statement about tú."],
              ["Abrid", "Abrid addresses vosotros."],
              [
                "Abrir",
                "The infinitive is not the ordinary tú imperative here.",
              ],
            ],
            "The affirmative tú command of abrir is abre.",
          ],
          [
            "put-bag",
            "Affirmative tú instruction: ___ la mochila aquí. (poner)",
            "Pon",
            [
              ["Pones", "Pones is indicative."],
              ["Poned", "Poned addresses vosotros."],
              ["Poner", "The infinitive is not the requested tú command."],
            ],
            "Poner has the irregular tú imperative pon.",
          ],
          [
            "come-kitchen",
            "Affirmative tú instruction: ___ a la cocina. (venir)",
            "Ven",
            [
              ["Vienes", "Vienes is indicative."],
              ["Venid", "Venid addresses vosotros."],
              ["Venir", "The infinitive is not the requested form."],
            ],
            "Venir has the irregular affirmative tú command ven.",
          ],
          [
            "make-copy",
            "Affirmative tú instruction: ___ una copia del recibo. (hacer)",
            "Haz",
            [
              ["Haces", "Haces is indicative."],
              ["Haced", "Haced addresses vosotros."],
              ["Hacer", "The infinitive does not give the requested tú form."],
            ],
            "The affirmative tú command of hacer is haz.",
          ],
          [
            "be-patient",
            "Affirmative tú instruction: ___ paciente con los principiantes. (ser)",
            "Sé",
            [
              ["Se", "The imperative sé needs an accent."],
              ["Eres", "Eres is indicative."],
              ["Sed", "Sed addresses vosotros."],
            ],
            "Ser has the affirmative tú imperative sé.",
          ],
          [
            "tell-name",
            "Affirmative tú instruction: ___ tu nombre al recepcionista. (decir)",
            "Di",
            [
              ["Dices", "Dices is indicative."],
              ["Decid", "Decid addresses vosotros."],
              ["Decir", "The infinitive is not the requested command."],
            ],
            "The affirmative tú imperative of decir is di.",
          ],
        ],
      ),
      r(
        "negative-tu",
        "Give negative tú commands",
        "Negative tú commands use no + present subjunctive. Their forms differ from affirmative tú commands, especially with irregular verbs.",
        "no hables; no comas; no abras; no vayas",
        ["No corras. — Do not run.", "No hagas ruido. — Do not make noise."],
        ["Do not put no in front of an affirmative tú imperative."],
        [
          [
            "dont-run",
            "Negative tú instruction: No ___ por las escaleras. (correr)",
            "corras",
            [
              ["corre", "Corre is an affirmative tú command or indicative."],
              ["corres", "Corres is indicative."],
              ["corráis", "Corráis addresses vosotros."],
            ],
            "Negative tú commands use corras.",
          ],
          [
            "dont-go",
            "Negative tú instruction: No ___ al muelle hoy. (ir)",
            "vayas",
            [
              ["ve", "Ve is the affirmative command."],
              ["vas", "Vas is indicative."],
              ["vayáis", "Vayáis addresses vosotros."],
            ],
            "The negative tú command of ir is no vayas.",
          ],
          [
            "dont-touch",
            "Negative tú instruction: No ___ el cristal. (tocar)",
            "toques",
            [
              ["toca", "Toca is the affirmative command."],
              ["tocas", "Tocas is indicative."],
              ["toces", "Qu preserves the /k/ sound before e."],
            ],
            "Tocar forms toques in the negative tú command.",
          ],
          [
            "dont-noise",
            "Negative tú instruction: No ___ ruido en la sala. (hacer)",
            "hagas",
            [
              ["haz", "Haz is affirmative only."],
              ["haces", "Haces is indicative."],
              ["hagáis", "Hagáis addresses vosotros."],
            ],
            "Hacer uses no hagas for negative tú instructions.",
          ],
          [
            "dont-leave",
            "Negative tú instruction: No ___ todavía. (salir)",
            "salgas",
            [
              ["sal", "Sal is the affirmative tú command."],
              ["sales", "Sales is indicative."],
              ["salgan", "Salgan addresses ustedes or refers to ellos."],
            ],
            "The negative tú form is no salgas.",
          ],
          [
            "dont-close",
            "Negative tú instruction: No ___ la aplicación. (cerrar)",
            "cierres",
            [
              ["cierra", "Cierra is the affirmative command."],
              ["cierras", "Cierras is indicative."],
              ["cerres", "The stressed stem changes e to ie."],
            ],
            "Negative tú uses the subjunctive cierres.",
          ],
        ],
      ),
      r(
        "usted-ustedes",
        "Address usted and ustedes",
        "Usted and ustedes commands use present subjunctive forms in both positive and negative instructions. Usted takes singular forms; ustedes takes plural forms.",
        "usted: pase / no pase; ustedes: pasen / no pasen",
        [
          "Firme aquí, por favor. — Please sign here.",
          "No entren todavía. — Do not come in yet.",
        ],
        ["Do not confuse respectful singular usted with plural ustedes."],
        [
          [
            "sign-usted",
            "To one person, usted: ___ aquí, por favor. (firmar)",
            "Firme",
            [
              ["Firma", "Firma is the tú command."],
              ["Firmen", "Firmen addresses several people."],
              ["Firmas", "Firmas is tú indicative."],
            ],
            "Usted takes firme.",
          ],
          [
            "sit-ustedes",
            "To several people, ustedes: ___ en estas sillas. (sentarse)",
            "Siéntense",
            [
              ["Siéntese", "Siéntese addresses one person."],
              ["Sentaos", "Sentaos addresses vosotros."],
              ["Siéntensen", "The final n must not be moved or duplicated."],
            ],
            "Ustedes takes siéntense, with the reflexive se attached.",
          ],
          [
            "dont-wait-usted",
            "To one person, usted: No ___ aquí. (esperar)",
            "espere",
            [
              ["espera", "Espera is the affirmative tú command or indicative."],
              ["esperes", "Esperes addresses tú."],
              ["esperen", "Esperen is plural."],
            ],
            "The negative usted command is no espere.",
          ],
          [
            "enter-ustedes",
            "To several people, ustedes: ___ por la puerta lateral. (entrar)",
            "Entren",
            [
              ["Entre", "Entre addresses one person."],
              ["Entrad", "Entrad addresses vosotros."],
              ["Entran", "Entran is indicative."],
            ],
            "Ustedes takes the plural command entren.",
          ],
          [
            "give-usted",
            "To one person, usted: ___ su nombre en recepción. (dar)",
            "Dé",
            [
              ["De", "The verb form dé requires an accent."],
              ["Da", "Da is the tú command."],
              ["Den", "Den addresses several people."],
            ],
            "Dar has the singular usted command dé.",
          ],
          [
            "dont-park-ustedes",
            "To several people, ustedes: No ___ delante del garaje. (aparcar)",
            "aparquen",
            [
              ["aparque", "Aparque is singular."],
              ["aparcan", "Aparcan is indicative."],
              ["aparqen", "Qu is required before e to preserve /k/."],
            ],
            "The negative ustedes command is no aparquen.",
          ],
        ],
      ),
      r(
        "vosotros-nosotros",
        "Use vosotros commands and shared suggestions",
        "Affirmative vosotros commands usually replace infinitive -r with -d. Negative vosotros uses the subjunctive. Nosotros suggestions also use the subjunctive; with reflexive nos, the final -s drops before attachment.",
        "hablad / no habléis; salgamos; sentémonos",
        [
          "Leed el aviso. — Read the notice (vosotros).",
          "Sentémonos aquí. — Let us sit here.",
        ],
        [
          "These vosotros forms are used in much of Spain; ustedes is normal for plural address in most of the Americas.",
        ],
        [
          [
            "vosotros-read",
            "Affirmative vosotros instruction: ___ la primera página. (leer)",
            "Leed",
            [
              ["Leen", "Leen is indicative."],
              ["Lee", "Lee addresses tú."],
              ["Leer", "The written vosotros imperative normally ends in -d."],
            ],
            "The affirmative vosotros command is leed.",
          ],
          [
            "vosotros-dont",
            "Negative vosotros instruction: No ___ el ascensor. (usar)",
            "uséis",
            [
              ["usad", "Usad is affirmative."],
              ["usáis", "Usáis is indicative."],
              ["usen", "Usen addresses ustedes."],
            ],
            "Negative vosotros uses the subjunctive uséis.",
          ],
          [
            "lets-leave",
            "Use the nosotros subjunctive command to suggest leaving: ___ ahora, antes de que llueva. (salir)",
            "Salgamos",
            [
              [
                "Salimos",
                "Salimos is indicative, not the requested subjunctive command.",
              ],
              ["Salid", "Salid addresses vosotros."],
              ["Salgan", "Salgan addresses ustedes."],
            ],
            "Salgamos is the nosotros exhortative.",
          ],
          [
            "lets-sit",
            "Let us sit here: ___ aquí. (sentarse, nosotros)",
            "Sentémonos",
            [
              ["Sentémosnos", "The final -s drops before attached nos."],
              ["Siéntense", "Siéntense addresses ustedes."],
              ["Sentaos", "Sentaos addresses vosotros."],
            ],
            "Sentemos + nos becomes sentémonos.",
          ],
          [
            "vosotros-open",
            "Affirmative vosotros instruction: ___ las mochilas. (abrir)",
            "Abrid",
            [
              ["Abre", "Abre addresses tú."],
              ["Abran", "Abran addresses ustedes."],
              ["Abrís", "Abrís is indicative."],
            ],
            "The affirmative vosotros imperative replaces -r with -d: abrid.",
          ],
          [
            "lets-not-forget",
            "A shared negative suggestion: No ___ los pasaportes. (olvidar, nosotros)",
            "olvidemos",
            [
              ["olvidamos", "The exhortation uses the subjunctive."],
              ["olvidéis", "Olvidéis addresses vosotros."],
              ["olviden", "Olviden addresses ustedes."],
            ],
            "No olvidemos is the nosotros negative exhortation.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-time-concession",
    "Time, conditions and concession",
    "B2",
    S5,
    "Time and concessive clauses can use different moods according to whether an event is asserted, habitual, expected or left open. The context, not a single trigger word, determines the meaning.",
    [
      r(
        "future-time",
        "Use subjunctive for pending time events",
        "Cuando, en cuanto and hasta que normally take the subjunctive when the event is still pending. Spanish does not ordinarily use a future indicative after cuando in this time-clause pattern.",
        "cuando / en cuanto / hasta que + subjunctive for a pending event",
        [
          "Te llamaré cuando llegue. — I will call when I arrive.",
          "Esperaremos hasta que abran. — We will wait until they open.",
        ],
        ["Do not transfer English future will into the pending cuando-clause."],
        [
          [
            "future-arrival",
            "Te llamaré cuando ___ mañana. (llegar, yo; pending arrival)",
            "llegue",
            [
              [
                "llegaré",
                "The pending cuando-clause uses subjunctive, not future.",
              ],
              ["llego", "The context is a pending event, not a habit."],
              ["llegues", "The intended subject is yo."],
            ],
            "Cuando llegue refers to the still-pending arrival.",
          ],
          [
            "open-gates",
            "Esperaremos hasta que ___ las puertas. (abrir, ellos; not open yet)",
            "abran",
            [
              ["abren", "The opening is pending."],
              ["abrirán", "This future time clause takes subjunctive."],
              ["abra", "The intended subject is ellos."],
            ],
            "Hasta que abran marks the event that will end the waiting.",
          ],
          [
            "as-soon-finish",
            "Te lo enviaré en cuanto lo ___ . (terminar, yo)",
            "termine",
            [
              ["terminaré", "A pending en cuanto-clause uses subjunctive."],
              [
                "termino",
                "The context is a future event, not a repeated habit.",
              ],
              ["termines", "The intended subject is yo."],
            ],
            "En cuanto termine means as soon as I finish the pending task.",
          ],
          [
            "train-leaves",
            "Compra agua antes de que ___ el tren. (salir)",
            "salga",
            [
              ["sale", "Antes de que takes subjunctive."],
              [
                "saldrá",
                "The future indicative is not used in this construction.",
              ],
              ["salgan", "Tren is singular."],
            ],
            "Antes de que salga places the purchase before the train’s departure.",
          ],
          [
            "get-home",
            "Cuando nosotros ___ a casa esta noche, descansaremos. (volver)",
            "volvamos",
            [
              ["volvemos", "This is a pending event, not a habit."],
              ["volveremos", "The time clause uses subjunctive."],
              ["vuelvan", "The subject is nosotros."],
            ],
            "The pending time clause uses volvamos.",
          ],
          [
            "notify-available",
            "Avísame en cuanto ___ una plaza libre. (haber, existential)",
            "haya",
            [
              ["hayan", "Existential haber remains singular."],
              ["habrá", "The pending en cuanto-clause takes subjunctive."],
              ["hay", "The available place is still pending."],
            ],
            "Haya is the singular subjunctive of impersonal haber.",
          ],
        ],
      ),
      r(
        "habitual-time",
        "Use indicative for asserted habits and past events",
        "Cuando and mientras can take the indicative for events asserted as real or repeated. A habitual present differs from a pending single future event.",
        "cuando + indicative for an asserted habit or completed event",
        [
          "Cuando llueve, llevo botas. — When it rains, I wear boots.",
          "Cuando llegué, la tienda estaba cerrada. — When I arrived, the shop was closed.",
        ],
        ["Cuando is not an automatic subjunctive trigger."],
        [
          [
            "habit-rain",
            "A regular habit: Cuando ___, llevo paraguas. (llover)",
            "llueve",
            [
              [
                "llueva",
                "The sentence states a recurring fact, not a pending event.",
              ],
              ["llover", "The time clause needs a finite verb."],
              ["llueven", "Impersonal llover is singular here."],
            ],
            "The asserted habit uses the indicative llueve.",
          ],
          [
            "past-arrival",
            "A completed event yesterday: Cuando ___, la tienda estaba cerrada. (llegar, yo)",
            "llegué",
            [
              ["llegue", "The past event is asserted, not pending."],
              ["llegues", "The subject and time are wrong."],
              ["llegar", "The clause needs a finite verb."],
            ],
            "Llegué reports the actual completed arrival.",
          ],
          [
            "weekday-routine",
            "Every weekday: Cuando ___ de trabajar, paseo al perro. (salir, yo)",
            "salgo",
            [
              ["salga", "The context states a regular habit."],
              ["salir", "The time clause needs a conjugated verb."],
              ["sales", "Sales refers to tú."],
            ],
            "Salgo describes the repeated actual routine.",
          ],
          [
            "simultaneous-past",
            "Actual simultaneous past actions: Mientras Ana ___, yo preparaba la mesa. (cocinar)",
            "cocinaba",
            [
              ["cocine", "The event is asserted in a past narrative."],
              ["cocinar", "A finite verb is required."],
              ["cocinabas", "The subject is Ana."],
            ],
            "Cocinaba describes the ongoing actual background action.",
          ],
          [
            "usual-call",
            "An established habit: Siempre llamo cuando ___ tiempo. (tener, yo)",
            "tengo",
            [
              [
                "tenga",
                "The stated context is habitual, not a pending occasion.",
              ],
              ["tener", "The time clause needs a finite verb."],
              ["tienes", "The intended subject is yo."],
            ],
            "Tengo presents having time as part of an established routine.",
          ],
          [
            "completed-opening",
            "A completed past event: En cuanto ___ la puerta, entramos. (abrir, ella)",
            "abrió",
            [
              ["abra", "The opening is asserted as completed."],
              ["abrieron", "The subject is ella, not ellos."],
              ["abrir", "The time clause needs a finite verb."],
            ],
            "Abrió reports the actual event that preceded our entry.",
          ],
        ],
      ),
      r(
        "concession",
        "Distinguish asserted and open concessions",
        "Aunque with the indicative commonly presents the obstacle as asserted. With the subjunctive it can present an unknown possibility or background an obstacle as irrelevant. Both moods can be valid with different meanings, so exercises specify the intended reading.",
        "aunque + indicative = asserted obstacle; aunque + subjunctive = open or backgrounded obstacle",
        [
          "Aunque está lejos, voy. — Although it is far, I am going.",
          "Aunque esté lejos, iré. — Even if it is far, I will go.",
        ],
        ["Do not label either mood universally wrong after aunque."],
        [
          [
            "rain-open",
            "Use the subjunctive to leave tomorrow’s weather open: Iré aunque ___ . (llover)",
            "llueva",
            [
              ["llueve", "The requested open possibility uses subjunctive."],
              ["llover", "The clause requires a finite verb."],
              ["lluevan", "Impersonal llover is singular."],
            ],
            "Llueva presents rain as an open possibility, not an asserted fact.",
          ],
          [
            "known-distance",
            "Use the indicative to assert the known distance: Aunque ___ lejos, vamos. (estar)",
            "está",
            [
              [
                "esté",
                "Subjunctive would background or leave open the obstacle; indicative was requested.",
              ],
              ["estar", "A finite verb is required."],
              ["están", "The implied destination is singular."],
            ],
            "Está asserts the destination’s known distance.",
          ],
          [
            "cost-open",
            "Use the subjunctive for an unknown price: Lo compraré aunque ___ caro. (ser)",
            "sea",
            [
              ["es", "The intended unknown obstacle uses subjunctive."],
              ["ser", "A finite verb is needed."],
              ["sean", "The item is singular."],
            ],
            "Sea does not assert that the item is expensive.",
          ],
          [
            "known-tiredness",
            "Use the indicative to assert my actual tiredness: Aunque ___ cansada, sigo. (estar, yo)",
            "estoy",
            [
              ["esté", "The requested asserted reading uses indicative."],
              ["estás", "Estás addresses tú."],
              ["estar", "A finite verb is needed."],
            ],
            "Estoy presents tiredness as an asserted fact.",
          ],
          [
            "regardless-time",
            "Use subjunctive to leave his availability open: Lo llamaré aunque no ___ tiempo. (tener, él)",
            "tenga",
            [
              ["tiene", "The requested open reading uses subjunctive."],
              ["tener", "The clause requires a finite verb."],
              ["tengan", "The subject is él."],
            ],
            "Aunque no tenga treats lack of time as a possible obstacle.",
          ],
          [
            "known-cold",
            "Use indicative to assert the measured cold: Aunque ___ mucho frío, salimos. (hacer)",
            "hace",
            [
              ["haga", "The requested asserted reading uses indicative."],
              ["hacen", "Weather hacer is impersonal singular."],
              ["hacer", "The clause needs a finite verb."],
            ],
            "Hace asserts the actual cold rather than leaving it open.",
          ],
        ],
      ),
      r(
        "conditional-links",
        "Use provided-that and unless clauses",
        "Con tal de que, a menos que and a condición de que introduce conditional circumstances with the subjunctive. Ordinary open si-conditions use the indicative instead.",
        "con tal de que / a menos que + subjunctive; si + present indicative",
        [
          "Iré con tal de que vengas. — I will go provided you come.",
          "Salimos si no llueve. — We go out if it does not rain.",
        ],
        [
          "Do not generalize the subjunctive of a menos que to an ordinary present si-clause.",
        ],
        [
          [
            "provided-seat",
            "Iré con tal de que ___ sitio. (haber, existential)",
            "haya",
            [
              ["hay", "Con tal de que takes subjunctive."],
              ["hayan", "Existential haber stays singular."],
              ["haber", "A finite verb is required."],
            ],
            "Con tal de que haya sets the condition; haya is impersonal singular.",
          ],
          [
            "unless-rain",
            "Saldremos a menos que ___ . (llover)",
            "llueva",
            [
              ["llueve", "A menos que takes subjunctive."],
              ["llueven", "Impersonal llover is singular."],
              ["llover", "The clause needs a finite verb."],
            ],
            "A menos que llueva means unless it rains.",
          ],
          [
            "condition-return",
            "Te presto el libro a condición de que lo ___ mañana. (devolver, tú)",
            "devuelvas",
            [
              ["devuelves", "A condición de que selects subjunctive."],
              ["devolver", "The clause needs a finite verb."],
              ["devuelvan", "The intended subject is tú."],
            ],
            "Devuelvas states the condition for lending the book.",
          ],
          [
            "open-if",
            "An ordinary open condition: Si ___ tiempo mañana, te llamaré. (tener, yo)",
            "tengo",
            [
              [
                "tenga",
                "An ordinary open present si-condition uses indicative.",
              ],
              [
                "tendré",
                "Future indicative is not used for this ordinary si-condition.",
              ],
              ["tener", "A finite verb is required."],
            ],
            "Si tengo is the ordinary present form for this open condition.",
          ],
          [
            "unless-delay",
            "Llegaremos a las ocho a menos que el tren se ___ . (retrasar)",
            "retrase",
            [
              ["retrasa", "A menos que takes subjunctive."],
              ["retrasen", "Tren is singular."],
              ["retrasar", "A finite verb is required."],
            ],
            "Retrase follows the conditional link a menos que.",
          ],
          [
            "provided-pay",
            "Reservarán la sala con tal de que nosotros ___ hoy. (pagar)",
            "paguemos",
            [
              ["pagamos", "Con tal de que takes subjunctive."],
              ["pagemos", "Gu preserves the hard g sound before e."],
              ["paguen", "The subject is nosotros."],
            ],
            "Paguemos is the nosotros subjunctive required by con tal de que.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-past-subjunctive-conditionals",
    "Past subjunctives and hypothetical conditions",
    "B2",
    S6,
    "Past subjunctive forms appear after past wishes and in hypothetical conditions. They can refer to present unreality as well as past time; the whole construction determines the time reference.",
    [
      r(
        "imperfect-subjunctive",
        "Form the imperfect subjunctive",
        "The imperfect subjunctive is built from the third-person plural preterite without -ron, then -ra, -ras, -ra, -ramos, -rais, -ran. The parallel -se forms are also valid. Nosotros forms carry a written accent before -ramos.",
        "hablaron → hablara; tuvieron → tuviera; fuéramos",
        [
          "Quería que vinieras. — I wanted you to come.",
          "Nos pidieron que habláramos. — They asked us to speak.",
        ],
        [
          "The -ra and -se series are both standard; this practice asks for -ra forms without rejecting -se.",
        ],
        [
          [
            "speak-past-request",
            "Use an imperfect subjunctive -ra form: Nos pidieron que nosotros ___ despacio. (hablar)",
            "habláramos",
            [
              ["hablaramos", "The nosotros form needs a written accent."],
              ["hablamos", "Hablamos is not imperfect subjunctive."],
              ["hablaran", "Hablaran refers to ellos/ustedes."],
            ],
            "Hablaron minus -ron plus -ramos gives habláramos.",
          ],
          [
            "come-past-wish",
            "Use an imperfect subjunctive -ra form: Quería que tú ___ a la reunión. (venir)",
            "vinieras",
            [
              ["venieras", "The preterite stem is vin-."],
              ["venías", "Venías is imperfect indicative."],
              ["vinieran", "Vinieran is plural third person."],
            ],
            "Vinieron supplies the stem for vinieras.",
          ],
          [
            "have-past",
            "Use an imperfect subjunctive -ra form: Dudaba que ella ___ la llave. (tener)",
            "tuviera",
            [
              ["teniera", "The preterite stem is tuv-."],
              ["tenía", "Tenía is imperfect indicative."],
              ["tuvieras", "Tuvieras refers to tú."],
            ],
            "Tuvieron supplies the stem for tuviera.",
          ],
          [
            "be-past",
            "Use an imperfect subjunctive -ra form: Esperaban que el trabajo ___ fácil. (ser)",
            "fuera",
            [
              ["era", "Era is imperfect indicative."],
              ["sería", "Sería is conditional indicative."],
              ["fueran", "Trabajo is singular."],
            ],
            "Ser uses the preterite stem fue- to form fuera.",
          ],
          [
            "go-past-group",
            "Use an imperfect subjunctive -ra form: Querían que nosotros ___ al archivo. (ir)",
            "fuéramos",
            [
              ["fueramos", "The nosotros form needs an accent."],
              ["íbamos", "Íbamos is imperfect indicative."],
              ["fueran", "Fueran is third-person plural."],
            ],
            "Fueron supplies the stem for fuéramos.",
          ],
          [
            "say-past",
            "Use an imperfect subjunctive -ra form: La jueza pidió que ellos ___ la verdad. (decir)",
            "dijeran",
            [
              ["dijieran", "Dijeron supplies dij-, without an extra i."],
              ["decían", "Decían is imperfect indicative."],
              ["dijeras", "Dijeras refers to tú."],
            ],
            "Dijeron loses -ron and adds -ran: dijeran.",
          ],
        ],
      ),
      r(
        "pluperfect-subjunctive",
        "Place a regretted event before a past reference point",
        "The pluperfect subjunctive combines hubiera or hubiese with a past participle. It can express an earlier event after a past emotional reaction or an unreal past wish.",
        "hubiera / hubiese + past participle",
        [
          "Sentí que no hubieras venido. — I was sorry you had not come.",
          "Ojalá hubiéramos reservado. — If only we had booked.",
        ],
        [
          "Do not use conditional habría where a past reaction selects subjunctive.",
        ],
        [
          [
            "regret-missed-meeting",
            "Use the pluperfect subjunctive: Sentí que tú no ___ venido a la reunión.",
            "hubieras",
            [
              [
                "habrías",
                "This emotional regret selects subjunctive, not conditional.",
              ],
              ["habías", "Habías is indicative."],
              ["hubieran", "The subject is tú."],
            ],
            "Hubieras venido expresses the earlier missed visit after the regret.",
          ],
          [
            "wish-booked",
            "Use the pluperfect subjunctive for our unreal past wish: Ojalá ___ reservado antes.",
            "hubiéramos",
            [
              ["habríamos", "Ojalá takes subjunctive for this wish."],
              ["habíamos", "The unreal past wish does not use indicative."],
              ["hubieran", "The intended subject is nosotros."],
            ],
            "Hubiéramos reservado places the unreal reservation before now.",
          ],
          [
            "past-closed",
            "Use the pluperfect subjunctive: Me sorprendió que la tienda ___ cerrado tan temprano.",
            "hubiera",
            [
              ["habría", "The reaction selects subjunctive."],
              ["había", "Había is indicative."],
              ["hubieran", "Tienda is singular."],
            ],
            "Hubiera cerrado expresses an event earlier than the surprise.",
          ],
          [
            "wrong-participle",
            "Use the pluperfect subjunctive of escribir: Ojalá yo hubiera ___ la dirección.",
            "escrito",
            [
              ["escribido", "The standard participle is escrito."],
              [
                "escribiendo",
                "Compound perfect forms take a participle, not a gerund.",
              ],
              ["escribir", "The auxiliary requires a participle."],
            ],
            "Haber + escrito forms the perfect construction.",
          ],
          [
            "group-arrival",
            "Use the pluperfect subjunctive: Lamentó que nosotros no ___ llegado a tiempo.",
            "hubiéramos",
            [
              ["habíamos", "This regret construction selects subjunctive."],
              ["habríamos", "Conditional does not satisfy the selected mood."],
              ["hubiera", "The subject is nosotros."],
            ],
            "Hubiéramos llegado matches nosotros and precedes the regret.",
          ],
          [
            "broken-cup",
            "Use the pluperfect subjunctive of romper: Sintió que la taza se hubiera ___ .",
            "roto",
            [
              ["rompido", "Romper has the irregular participle roto."],
              ["rompiendo", "The perfect construction needs a participle."],
              ["romper", "An infinitive does not follow hubiera here."],
            ],
            "Hubiera roto uses the irregular participle roto.",
          ],
        ],
      ),
      r(
        "unreal-present",
        "Build hypothetical present or future conditions",
        "A remote or contrary-to-fact condition commonly uses si + imperfect subjunctive and a conditional result. Ordinary open conditions use a different pattern, si + present indicative.",
        "si + imperfect subjunctive, conditional",
        [
          "Si tuviera tiempo, iría. — If I had time, I would go.",
          "Si viviéramos cerca, nos veríamos más. — If we lived nearby, we would see one another more.",
        ],
        ["Do not use conditional tendría in this si-clause."],
        [
          [
            "no-money",
            "I do not have enough money now: Si ___ dinero, compraría la bicicleta. (tener, yo)",
            "tuviera",
            [
              [
                "tendría",
                "This hypothetical si-clause needs imperfect subjunctive.",
              ],
              [
                "tengo",
                "That would create an open condition, not the stated contrary-to-fact one.",
              ],
              ["tuve", "Tuve is an asserted past event."],
            ],
            "Tuviera presents the unreal present condition.",
          ],
          [
            "no-car",
            "I have no car now: Si tuviera coche, ___ al pueblo. (ir, yo; conditional simple)",
            "iría",
            [
              [
                "voy",
                "The requested conditional result is not present indicative.",
              ],
              ["fuera", "The requested result form is conditional simple."],
              ["irán", "Irán is plural future."],
            ],
            "Iría is the conditional simple result of the hypothetical condition.",
          ],
          [
            "far-home",
            "We live far away: Si ___ cerca, os visitaríamos más. (vivir, nosotros)",
            "viviéramos",
            [
              ["viviríamos", "The si-clause takes imperfect subjunctive."],
              ["vivimos", "The context is contrary to the actual present."],
              ["vivieran", "The subject is nosotros."],
            ],
            "Viviéramos expresses the unreal condition for the speaking group.",
          ],
          [
            "no-key",
            "She does not know the code: Si lo ___, abriría la caja. (saber, ella)",
            "supiera",
            [
              ["sabría", "The si-clause needs imperfect subjunctive."],
              ["sabe", "That changes the condition to an open one."],
              ["supieras", "The subject is ella."],
            ],
            "Saber uses supiera for the unreal condition.",
          ],
          [
            "not-mayor",
            "A hypothetical role: Si yo fuera alcalde, ___ el parque. (mejorar, conditional simple)",
            "mejoraría",
            [
              ["mejoro", "The requested result is conditional simple."],
              ["mejorara", "The requested result form is conditional simple."],
              ["mejorarán", "Mejorarán is plural future."],
            ],
            "Mejoraría states the imagined result.",
          ],
          [
            "no-time",
            "You have no free time now: Si ___ más tiempo, descansarías. (tener, tú)",
            "tuvieras",
            [
              [
                "tendrías",
                "The conditional does not belong in this si-clause.",
              ],
              [
                "tienes",
                "That makes an open condition instead of the stated unreal one.",
              ],
              ["tuvieran", "The subject is tú."],
            ],
            "Tuvieras expresses the contrary-to-fact present condition.",
          ],
        ],
      ),
      r(
        "unreal-past",
        "Build unreal past conditions and results",
        "An unreal past condition uses si + pluperfect subjunctive. A conditional perfect can express the unreal result. A pluperfect subjunctive can also be valid in many result clauses, so it is not treated as a wrong alternative.",
        "si + hubiera / hubiese + participle, habría + participle",
        [
          "Si hubieras avisado, habría ido. — If you had told me, I would have gone.",
          "Si hubiéramos salido antes, habríamos llegado. — If we had left earlier, we would have arrived.",
        ],
        ["In the condition clause, do not replace hubiera with habría."],
        [
          [
            "missed-warning",
            "You did not warn me: Si me ___ avisado, habría ido. (tú)",
            "hubieras",
            [
              [
                "habrías",
                "The condition after si needs pluperfect subjunctive.",
              ],
              [
                "habías",
                "This is indicative, not the stated unreal condition.",
              ],
              ["hubieran", "The intended subject is tú."],
            ],
            "Si hubieras avisado expresses the unreal past condition.",
          ],
          [
            "missed-train-result",
            "Use conditional perfect: Si hubiera corrido, ___ alcanzado el tren. (yo)",
            "habría",
            [
              ["había", "Había is pluperfect indicative."],
              ["habré", "Habré is future perfect."],
              ["habrías", "Habrías refers to tú, not yo."],
            ],
            "Habría alcanzado is the conditional perfect result.",
          ],
          [
            "earlier-start",
            "We left too late: Si ___ salido antes, habríamos llegado a tiempo.",
            "hubiéramos",
            [
              ["habríamos", "The si-condition needs subjunctive."],
              ["habíamos", "The stated unreal condition needs subjunctive."],
              ["hubieran", "The intended subject is nosotros."],
            ],
            "Hubiéramos salido places the unreal departure in the past.",
          ],
          [
            "forgotten-map",
            "Use conditional perfect: Si hubieras traído el mapa, no nos ___ perdido. (nosotros)",
            "habríamos",
            [
              ["habíamos", "Habíamos reports an actual earlier event."],
              ["habremos", "Habremos is future perfect."],
              ["habrían", "Habrían does not agree with nosotros."],
            ],
            "Nos habríamos perdido is the conditional perfect for nosotros.",
          ],
          [
            "closed-booking",
            "They did not book: Si ___ reservado, habrían tenido mesa. (ellos)",
            "hubieran",
            [
              ["habrían", "The si-condition needs pluperfect subjunctive."],
              ["habían", "The stated unreal past condition needs subjunctive."],
              ["hubieras", "Hubieras addresses tú."],
            ],
            "Hubieran reservado is the unreal condition for ellos.",
          ],
          [
            "missed-reading",
            "Use conditional perfect: Si lo hubiera leído, ___ entendido el problema. (ella)",
            "habría",
            [
              ["había", "Había is indicative past, not conditional perfect."],
              ["habrá", "Habrá is future perfect."],
              ["habríamos", "Habríamos refers to nosotros."],
            ],
            "Habría entendido expresses the unreal past result for ella.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-relative-clauses",
    "Relative clauses and pronouns",
    "B2",
    S6,
    "Relative clauses describe nouns or refer to an idea. Choose forms according to their role, required preposition and whether the reference is a person, possession, place or whole proposition.",
    [
      r(
        "relative-que",
        "Link descriptions with que",
        "Unaccented que is the most general relative. It can refer to people or things. Spanish does not omit this relative in the ordinary defining clauses practised here, even when it represents an object.",
        "noun + que + clause",
        [
          "La persona que llamó dejó su número. — The person who called left a number.",
          "El libro que compré es nuevo. — The book I bought is new.",
        ],
        ["Do not confuse relative que with interrogative qué."],
        [
          [
            "ordered-book",
            "El libro ___ encargué ya está aquí.",
            "que",
            [
              ["qué", "A relative is unaccented; this is not a question."],
              ["quién", "Quién is interrogative and refers to people."],
              [
                "cuyo",
                "Cuyo requires a following noun that names a possession.",
              ],
            ],
            "Que introduces the defining relative clause about el libro.",
          ],
          [
            "neighbor-lives",
            "La vecina ___ vive arriba es enfermera.",
            "que",
            [
              ["quién", "The interrogative quién is not a relative here."],
              ["cuyo", "Cuyo must accompany a possessed noun."],
              ["donde", "Donde refers to a place, not this person as subject."],
            ],
            "Que is the subject relative referring to la vecina.",
          ],
          [
            "route-chose",
            "La ruta ___ elegimos pasa por el bosque.",
            "que",
            [
              ["qué", "This is a relative clause, not an interrogative."],
              ["quienes", "Quienes refers to plural people."],
              ["cuyas", "Cuyas needs a following possessed noun."],
            ],
            "Que represents the route chosen as the object of elegimos.",
          ],
          [
            "letters-arrived",
            "Las cartas ___ llegaron ayer están en la mesa.",
            "que",
            [
              ["qué", "Relative que has no accent."],
              ["quien", "Quien refers to a person, not letters."],
              [
                "cuyos",
                "Cuyos requires a following masculine plural possessed noun.",
              ],
            ],
            "Que connects las cartas to the event of arriving.",
          ],
          [
            "colleague-helped",
            "El compañero ___ me ayudó trabaja en recepción.",
            "que",
            [
              ["quién", "Quién is interrogative, not relative."],
              ["donde", "Donde would refer to a place."],
              ["cuya", "Cuya needs a following possessed noun."],
            ],
            "Que identifies the colleague through the help he gave.",
          ],
          [
            "document-signed",
            "Este es el documento ___ firmaste.",
            "que",
            [
              ["qué", "The relative is unaccented."],
              ["quienes", "Quienes cannot refer to one document."],
              ["cuyo", "No possessed noun follows."],
            ],
            "Spanish keeps que where English may omit the object relative.",
          ],
        ],
      ),
      r(
        "relative-prepositions",
        "Keep prepositions in relative constructions",
        "A relative retains the preposition required by its role: la persona con quien trabajo, el tema del que hablamos. Quien/quienes refers to people; el que and el cual series can refer to people or things with appropriate agreement.",
        "con quien; de la que; por el que; a quienes",
        [
          "La mujer con quien hablé es la directora. — The woman I spoke with is the director.",
          "Ese es el asunto del que hablamos. — That is the matter we discussed.",
        ],
        [
          "Do not leave a required preposition stranded at the end as in English.",
        ],
        [
          [
            "speak-with",
            "La intérprete con ___ hablé llegará pronto.",
            "quien",
            [
              ["quién", "Relative quien has no written accent."],
              ["cuyo", "Cuyo must modify a possessed noun."],
              ["donde", "Donde refers to a place."],
            ],
            "Con quien refers to the person I spoke with.",
          ],
          [
            "plural-people",
            "Las personas a ___ invitamos ya han llegado.",
            "quienes",
            [
              ["quien", "The antecedent personas is plural."],
              [
                "quiénes",
                "Interrogative quiénes is accented; this relative is not.",
              ],
              ["cuyo", "Cuyo does not stand alone for invited people."],
            ],
            "Quienes agrees in number with personas after the personal a.",
          ],
          [
            "talk-about",
            "La cuestión de ___ hablamos sigue sin resolverse.",
            "la que",
            [
              ["el que", "Cuestión is feminine."],
              ["los que", "Cuestión is singular feminine."],
              ["quien", "Quien refers to people."],
            ],
            "De la que preserves hablar de and agrees with la cuestión.",
          ],
          [
            "reason-for",
            "Ese es el motivo por ___ renuncié.",
            "el que",
            [
              ["la que", "Motivo is masculine."],
              ["los que", "Motivo is singular."],
              ["quien", "Quien refers to people."],
            ],
            "Por el que refers to the masculine singular motivo.",
          ],
          [
            "depend-on",
            "Los datos de ___ depende el cálculo están incompletos.",
            "los que",
            [
              ["la que", "Datos is masculine plural."],
              ["el que", "Datos is plural."],
              ["quienes", "Quienes refers to people."],
            ],
            "De los que preserves depender de and matches datos.",
          ],
          [
            "work-with-plural",
            "Los colegas con ___ colaboro viven en Quito.",
            "quienes",
            [
              ["quien", "Colegas is plural."],
              ["quiénes", "The relative form is unaccented."],
              [
                "cuyas",
                "Cuyas must accompany a feminine plural possessed noun.",
              ],
            ],
            "Con quienes refers to the plural people with whom I collaborate.",
          ],
        ],
      ),
      r(
        "relative-possession",
        "Make cuyo agree with the possession",
        "Cuyo, cuya, cuyos and cuyas mean whose. They agree with the possessed noun that follows, not with the possessor. No article is inserted between cuyo and that noun.",
        "possessor + cuyo/a/os/as + possessed noun",
        [
          "La autora cuya novela leí viene hoy. — The author whose novel I read is coming today.",
          "El edificio cuyos ascensores fallan está cerrado. — The building whose lifts fail is closed.",
        ],
        ["Do not write cuyo la novela; whose is not cuyó."],
        [
          [
            "author-novel",
            "La autora ___ novela ganó el premio dará una charla.",
            "cuya",
            [
              ["cuyo", "Novela is feminine."],
              ["cuyas", "Novela is singular."],
              ["cuyos", "Novela is feminine singular."],
            ],
            "Cuya agrees with the possessed noun novela.",
          ],
          [
            "teacher-students",
            "La profesora ___ alumnos ganaron el concurso está orgullosa.",
            "cuyos",
            [
              ["cuya", "Alumnos is masculine plural."],
              ["cuyo", "Alumnos is plural."],
              ["cuyas", "Alumnos is masculine."],
            ],
            "Cuyos agrees with alumnos, not with profesora.",
          ],
          [
            "writer-letters",
            "El escritor ___ cartas publicaron vivió en esta casa.",
            "cuyas",
            [
              ["cuyo", "Cartas is feminine plural."],
              ["cuya", "Cartas is plural."],
              ["cuyos", "Cartas is feminine."],
            ],
            "Cuyas agrees with the feminine plural possession cartas.",
          ],
          [
            "family-car",
            "La familia ___ coche se averió pidió ayuda.",
            "cuyo",
            [
              ["cuya", "Coche is masculine."],
              ["cuyos", "Coche is singular."],
              ["cuyas", "Coche is masculine singular."],
            ],
            "Cuyo agrees with coche, regardless of the feminine possessor familia.",
          ],
          [
            "museum-rooms",
            "El museo ___ salas visitamos abre los domingos.",
            "cuyas",
            [
              ["cuyo", "Salas is feminine plural."],
              ["cuya", "Salas is plural."],
              ["cuyos", "Salas is feminine."],
            ],
            "Cuyas agrees with salas.",
          ],
          [
            "company-director",
            "La empresa ___ director conocí está creciendo.",
            "cuyo",
            [
              ["cuya", "Director is masculine."],
              ["cuyos", "Director is singular."],
              ["cuyas", "Director is masculine singular."],
            ],
            "Cuyo agrees with director rather than empresa.",
          ],
        ],
      ),
      r(
        "relative-place-idea",
        "Refer to places and whole ideas",
        "Donde can introduce a location relative. Lo que can mean what/the thing that without a named noun; lo cual can refer back to a whole preceding proposition. Both lo que and lo cual can sometimes refer to a proposition, so examples avoid treating their overlap as an error.",
        "el lugar donde; lo que + clause; proposition, lo cual + clause",
        [
          "Este es el pueblo donde nací. — This is the village where I was born.",
          "No entiendo lo que dices. — I do not understand what you say.",
        ],
        ["Do not put a written accent on relative donde or que."],
        [
          [
            "birthplace",
            "Este es el pueblo ___ nací.",
            "donde",
            [
              ["dónde", "Relative donde is unaccented."],
              ["quien", "Quien refers to people."],
              ["cuyo", "No possessed noun follows."],
            ],
            "Donde expresses the place of birth.",
          ],
          [
            "what-needed",
            "No sé ___ necesitas. (the thing that you need)",
            "lo que",
            [
              [
                "lo cual",
                "Lo cual normally needs a preceding antecedent and cannot head this free relative.",
              ],
              ["quien", "Quien refers to a person."],
              ["cuyo", "Cuyo must accompany a possessed noun."],
            ],
            "Lo que can head a relative meaning the thing that.",
          ],
          [
            "take-what",
            "Lleva solo ___ puedas cargar. (whatever things you can carry)",
            "lo que",
            [
              ["lo cual", "Lo cual cannot head this free relative."],
              ["quien", "The meaning concerns things, not a person."],
              ["cuya", "No possessed noun follows."],
            ],
            "Lo que heads the relative object without a named antecedent.",
          ],
          [
            "shop-location",
            "La tienda ___ compramos el pan está cerrada.",
            "donde",
            [
              ["dónde", "The relative is not an interrogative."],
              ["quienes", "Quienes refers to people."],
              ["cuyo", "No possessed noun follows."],
            ],
            "Donde describes the location of the bread purchase.",
          ],
          [
            "understand-what",
            "Explícame ___ ocurrió. (the thing that happened)",
            "lo que",
            [
              [
                "lo cual",
                "Lo cual cannot head this free relative without an antecedent.",
              ],
              ["cuyo", "Cuyo requires a following noun."],
              ["quienes", "The event is not a group of people."],
            ],
            "Lo que refers to what happened without a named antecedent.",
          ],
          [
            "campsite",
            "Buscamos el camping ___ dejamos la bicicleta.",
            "donde",
            [
              ["dónde", "Relative donde has no accent."],
              ["quien", "Quien refers to people."],
              ["cuyas", "No possessed noun follows."],
            ],
            "Donde links the campsite to the place where the bicycle was left.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-passive-impersonal-se",
    "Passive voice and the uses of se",
    "B2",
    S6,
    "Spanish can shift attention away from an agent using a ser passive, a passive with se or an impersonal se construction. Reflexive and reciprocal se have different roles.",
    [
      r(
        "ser-passive",
        "Build ser + participle passives",
        "The ser passive makes the affected entity the grammatical subject. The participle agrees with that subject in gender and number. Por can identify the agent. Estar + participle commonly describes a resulting state instead.",
        "subject + ser + agreeing participle + por + agent",
        [
          "La carta fue enviada ayer. — The letter was sent yesterday.",
          "Los cuadros fueron restaurados. — The paintings were restored.",
        ],
        [
          "After ser, the passive participle agrees; after auxiliary haber it does not.",
        ],
        [
          [
            "letter-sent",
            "Complete the ser passive: La carta fue ___ ayer. (enviar)",
            "enviada",
            [
              ["enviado", "Carta is feminine."],
              ["enviadas", "Carta is singular."],
              ["enviando", "A passive takes a participle, not a gerund."],
            ],
            "Enviada agrees with la carta.",
          ],
          [
            "bridges-repaired",
            "Complete the ser passive: Los puentes fueron ___ en verano. (reparar)",
            "reparados",
            [
              ["reparado", "Puentes is plural."],
              ["reparadas", "Puentes is masculine."],
              ["reparando", "The passive needs a participle."],
            ],
            "Reparados agrees with the masculine plural subject.",
          ],
          [
            "exhibition-opened",
            "Complete the ser passive: La exposición será ___ por la alcaldesa. (inaugurar)",
            "inaugurada",
            [
              ["inaugurado", "Exposición is feminine."],
              ["inauguradas", "The subject is singular."],
              ["inaugurando", "A gerund does not form this passive."],
            ],
            "Inaugurada agrees with la exposición.",
          ],
          [
            "mural-agent",
            "Complete the agent phrase: El mural fue pintado ___ un grupo de estudiantes.",
            "por",
            [
              [
                "para",
                "Para would identify a beneficiary rather than the agent.",
              ],
              ["hacia", "Hacia gives direction."],
              ["sin", "Sin means without."],
            ],
            "Por identifies who painted the mural.",
          ],
          [
            "documents-signed",
            "Complete the ser passive: Las actas han sido ___ por todos. (firmar)",
            "firmadas",
            [
              ["firmado", "The passive participle agrees with actas."],
              ["firmados", "Actas is feminine."],
              ["firmando", "The construction needs a participle."],
            ],
            "Firmadas agrees with las actas even though sido belongs to the compound auxiliary.",
          ],
          [
            "prize-awarded",
            "Complete the ser passive: El premio fue ___ a una científica. (conceder)",
            "concedido",
            [
              ["concedida", "Premio is masculine."],
              ["concedidos", "Premio is singular."],
              ["concediendo", "The passive needs a participle."],
            ],
            "Concedido agrees with el premio.",
          ],
        ],
      ),
      r(
        "passive-se",
        "Make passive se agree with its subject",
        "In a passive se construction, the affected noun functions as subject. The verb agrees with it. These examples use things, avoiding the special patterns of personal objects.",
        "se + singular verb + singular subject; se + plural verb + plural subject",
        [
          "Se vende una bicicleta. — A bicycle is for sale.",
          "Se venden bicicletas. — Bicycles are for sale.",
        ],
        [
          "Do not ignore the plural subject in the standard passive se pattern.",
        ],
        [
          [
            "houses-sale",
            "Standard passive se: Se ___ casas. (vender, present)",
            "venden",
            [
              ["vende", "Casas is the plural passive subject."],
              ["vendes", "The construction does not address tú."],
              [
                "vendemos",
                "The construction does not have nosotros as subject.",
              ],
            ],
            "Venden agrees with casas in this passive se construction.",
          ],
          [
            "room-rent",
            "Standard passive se: Se ___ una habitación. (alquilar, present)",
            "alquila",
            [
              ["alquilan", "Habitación is singular."],
              ["alquilas", "The construction does not address tú."],
              ["alquilamos", "Nosotros is not the subject."],
            ],
            "Alquila agrees with una habitación.",
          ],
          [
            "tickets-sold",
            "Standard passive se: Las entradas se ___ ayer. (vender, preterite)",
            "vendieron",
            [
              ["vendió", "Entradas is plural."],
              ["vendiste", "The construction has no tú subject."],
              ["vendimos", "Nosotros is not the subject."],
            ],
            "Vendieron agrees with las entradas.",
          ],
          [
            "copies-made",
            "Standard passive se: Aquí se ___ fotocopias. (hacer, present)",
            "hacen",
            [
              ["hace", "Fotocopias is plural."],
              ["haces", "The construction is not addressed to tú."],
              ["hacemos", "Nosotros is not the subject."],
            ],
            "Hacen agrees with fotocopias.",
          ],
          [
            "report-published",
            "Standard passive se: El informe se ___ mañana. (publicar, future)",
            "publicará",
            [
              ["publicarán", "Informe is singular."],
              ["publicarás", "The construction does not address tú."],
              ["publicaremos", "Nosotros is not the subject."],
            ],
            "Publicará agrees with el informe.",
          ],
          [
            "languages-teach",
            "Standard passive se: Se ___ varios idiomas. (enseñar, present)",
            "enseñan",
            [
              ["enseña", "Idiomas is plural."],
              ["enseñas", "The construction has no tú subject."],
              ["enseñamos", "Nosotros is not the subject."],
            ],
            "Enseñan agrees with varios idiomas.",
          ],
        ],
      ),
      r(
        "impersonal-se",
        "Keep impersonal se in the singular",
        "Impersonal se has no grammatical subject and uses third-person singular. A personal direct object introduced by a does not control agreement. Intransitive and prepositional-complement examples are also singular.",
        "se + third-person singular; se entrevista a los candidatos",
        [
          "Se vive bien aquí. — People live well here.",
          "Se entrevistó a las candidatas. — The candidates were interviewed.",
        ],
        ["Do not make the verb agree with an a-marked personal object."],
        [
          [
            "live-here",
            "Impersonal se: Aquí se ___ bien. (vivir, present)",
            "vive",
            [
              ["viven", "There is no plural grammatical subject."],
              ["vives", "The construction is not addressed to tú."],
              ["vivimos", "Nosotros is not a subject here."],
            ],
            "Impersonal se uses third-person singular vive.",
          ],
          [
            "interview-candidates",
            "Standard impersonal se: Se ___ a las candidatas ayer. (entrevistar)",
            "entrevistó",
            [
              [
                "entrevistaron",
                "A las candidatas is a personal object, not a plural subject.",
              ],
              ["entrevistaste", "The construction has no tú subject."],
              ["entrevistamos", "The construction has no nosotros subject."],
            ],
            "The a-marked personal object does not control agreement: se entrevistó.",
          ],
          [
            "respect-elders",
            "Standard impersonal se: Se ___ a los mayores. (respetar, present)",
            "respeta",
            [
              ["respetan", "A los mayores is an object, not the subject."],
              ["respetas", "There is no tú subject."],
              ["respetamos", "There is no nosotros subject."],
            ],
            "The impersonal verb stays singular despite the plural personal object.",
          ],
          [
            "work-team",
            "Impersonal se: En equipo se ___ mejor. (trabajar, present)",
            "trabaja",
            [
              ["trabajan", "The construction has no plural subject."],
              ["trabajas", "The construction has no tú subject."],
              ["trabajamos", "Nosotros is not expressed as subject here."],
            ],
            "Trabajar is intransitive here; impersonal se takes trabaja.",
          ],
          [
            "talk-topics",
            "Standard impersonal se: Se ___ de varios asuntos en la reunión. (hablar, preterite)",
            "habló",
            [
              [
                "hablaron",
                "De varios asuntos is a prepositional complement, not a subject.",
              ],
              ["hablaste", "The construction has no tú subject."],
              ["hablamos", "The construction has no nosotros subject."],
            ],
            "Hablar de has a prepositional complement, so the impersonal verb is singular.",
          ],
          [
            "reach-temperature",
            "Standard impersonal se: Ayer se ___ a cuarenta grados. (llegar, preterite)",
            "llegó",
            [
              ["llegaron", "A cuarenta grados is not a plural subject."],
              ["llegaste", "The construction has no tú subject."],
              ["llegamos", "The construction has no nosotros subject."],
            ],
            "The prepositional complement does not affect singular llegó.",
          ],
        ],
      ),
      r(
        "reflexive-reciprocal-se",
        "Distinguish reflexive, reciprocal and pronominal uses",
        "Reflexive pronouns refer back to the subject. A plural reflexive may be reciprocal when context means each other. Some verbs are obligatorily pronominal in a meaning, such as arrepentirse; not every se expresses a passive.",
        "ella se lava; ellos se saludan; se arrepiente de",
        [
          "Ella se peina. — She combs her own hair.",
          "Los vecinos se ayudan mutuamente. — The neighbors help each other.",
        ],
        ["Use context to distinguish themselves from each other."],
        [
          [
            "reflexive-self",
            "She combs her own hair: Ana ___ peina frente al espejo.",
            "se",
            [
              ["me", "Me would make the speaker the object."],
              ["te", "Te would make the listener the object."],
              ["nos", "Nos would make us the object."],
            ],
            "Se refers back to Ana, the subject doing the action to herself.",
          ],
          [
            "reciprocal-each",
            "Los compañeros se ayudan mutuamente. Here se means ___.",
            "each other",
            [
              [
                "an unnamed passive agent",
                "Mutuamente makes the reciprocal relation explicit.",
              ],
              [
                "only themselves individually",
                "Mutuamente signals a relation between participants.",
              ],
              ["the speaker", "The speaker is not the referent of se here."],
            ],
            "Mutuamente establishes the reciprocal meaning each other.",
          ],
          [
            "regret-pronominal",
            "Marta ___ arrepiente de su decisión.",
            "se",
            [
              [
                "le",
                "Arrepentirse requires the subject-linked pronominal form.",
              ],
              [
                "la",
                "La is a direct-object form, not the required pronominal marker.",
              ],
              ["lo", "Lo is a direct-object form, not the required marker."],
            ],
            "Arrepentirse uses se with Marta.",
          ],
          [
            "hands-reflexive",
            "He washes his own hands: Luis ___ lava las manos.",
            "se",
            [
              ["me", "Me would make the speaker the affected person."],
              ["te", "Te would make the listener the affected person."],
              ["nos", "Nos would make us the affected people."],
            ],
            "Se marks Luis as the person whose hands he washes.",
          ],
          [
            "complain-pronominal",
            "Los clientes ___ quejan del ruido.",
            "se",
            [
              [
                "los",
                "Quejarse takes a pronominal form, not a direct-object replacement.",
              ],
              ["las", "Las is not the required subject-linked form."],
              ["le", "Le is not the pronominal marker of quejarse."],
            ],
            "Quejarse uses se for the third-person plural subject.",
          ],
          [
            "reciprocal-greeting",
            "Las dos amigas se saludaron una a la otra. The action is ___.",
            "reciprocal",
            [
              ["impersonal", "The two friends are an explicit subject."],
              ["a passive with se", "The friends act on one another."],
              [
                "directed only at the speaker",
                "The speaker is not the object named by the context.",
              ],
            ],
            "Una a la otra makes the reciprocal relationship explicit.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-reported-speech",
    "Reporting statements, questions and requests",
    "B2",
    S6,
    "Reported language changes person, time reference and sometimes tense to fit the new viewpoint. Tense shifts are not mechanically mandatory: the exercises specify a past reporting viewpoint when a shift is requested.",
    [
      r(
        "reported-statements",
        "Maintain a stated past reporting viewpoint",
        "A past reporting viewpoint can shift a simultaneous present to imperfect, an earlier past to pluperfect and a later future to conditional. A fact still presented as current may retain a present tense, so the intended viewpoint must be explicit.",
        "dijo que estaba; explicó que había salido; anunció que vendría",
        [
          "Dijo: «Estoy cansada». → Dijo que estaba cansada.",
          "Anunció: «Volveré». → Anunció que volvería.",
        ],
        [
          "Do not treat every retained present as ungrammatical; it may express continuing relevance.",
        ],
        [
          [
            "tired-report",
            "Shift to the past viewpoint: Ana dijo «Estoy cansada». Ana dijo que ___ cansada.",
            "estaba",
            [
              ["estoy", "The report changes first person to third person."],
              [
                "estaría",
                "Conditional would place the state later, not simultaneous.",
              ],
              ["estabas", "Estabas refers to tú."],
            ],
            "Estaba presents Ana’s state as simultaneous with her past statement.",
          ],
          [
            "future-return",
            "Shift the future relative to a past statement: Él anunció «Volveré». Anunció que ___ .",
            "volvería",
            [
              ["volveré", "The report is third person, not first person."],
              ["había vuelto", "This places the return earlier, not later."],
              ["volverías", "This refers to tú."],
            ],
            "Volvería is future-in-the-past for his announced return.",
          ],
          [
            "earlier-leave",
            "Mark the departure as earlier than the report: Dijo «Ya salí». Dijo que ya ___ salido.",
            "había",
            [
              [
                "habría",
                "Conditional perfect would change the intended time relation.",
              ],
              ["he", "He keeps first person."],
              ["habías", "Habías addresses tú."],
            ],
            "Había salido places the departure before the past reporting event.",
          ],
          [
            "living-report",
            "Use imperfect to keep a past viewpoint: Eva dijo «Vivo cerca». Dijo que ___ cerca.",
            "vivía",
            [
              ["vivo", "The speaker is now third person."],
              [
                "viviría",
                "Conditional would suggest future-in-the-past or a hypothesis.",
              ],
              ["vivías", "Vivías refers to tú."],
            ],
            "Vivía reports the residence as simultaneous with Eva’s past statement.",
          ],
          [
            "our-future",
            "Report the group in third person, future-in-the-past: Dijeron «Llegaremos pronto». Dijeron que ___ pronto.",
            "llegarían",
            [
              ["llegaremos", "This remains first-person plural."],
              ["habían llegado", "This places arrival before the statement."],
              ["llegarías", "This refers to tú."],
            ],
            "Llegarían gives the later arrival from the group’s past viewpoint.",
          ],
          [
            "earlier-booked",
            "Mark their booking as earlier: Dijeron «Ya reservamos». Dijeron que ya ___ reservado.",
            "habían",
            [
              [
                "habrían",
                "This changes the requested earlier factual relation.",
              ],
              ["hemos", "This keeps first-person plural."],
              ["había", "The group is plural."],
            ],
            "Habían reservado is pluperfect for the earlier booking.",
          ],
        ],
      ),
      r(
        "reported-questions",
        "Report questions with si and accented question words",
        "A reported yes/no question uses si. Wh-questions retain the required interrogative word and its accent, such as dónde, cuándo or qué. The report normally has no question marks unless the whole sentence is itself a question.",
        "preguntó si; preguntó dónde / cuándo / qué",
        [
          "Preguntó si teníamos reserva. — He/she asked whether we had a booking.",
          "Quiso saber dónde estaba la estación. — He/she wanted to know where the station was.",
        ],
        ["Interrogative words keep their accent in indirect questions."],
        [
          [
            "whether-open",
            "Preguntó ___ la tienda estaba abierta. (whether)",
            "si",
            [
              ["sí", "Sí with an accent means yes or a reflexive pronoun."],
              ["que", "A yes/no question is introduced by si."],
              ["para", "Para does not introduce this reported question."],
            ],
            "Unaccented si introduces the reported yes/no question.",
          ],
          [
            "where-station",
            "Quería saber ___ estaba la estación. (where)",
            "dónde",
            [
              ["donde", "An indirect interrogative keeps the written accent."],
              ["cuya", "Cuya introduces possession, not a place question."],
              ["quien", "Quien does not ask about place."],
            ],
            "Dónde is accented in this indirect question.",
          ],
          [
            "when-office",
            "Preguntó ___ abría la oficina. (when)",
            "cuándo",
            [
              ["cuando", "The indirect interrogative keeps its accent."],
              ["cuanto", "Cuanto relates to amount, not time."],
              ["quien", "Quien refers to a person."],
            ],
            "Cuándo asks about time within the reported question.",
          ],
          [
            "what-needed-report",
            "Me preguntó ___ necesitaba. (what)",
            "qué",
            [
              ["que", "The indirect interrogative requires an accent."],
              ["cuya", "Cuya requires a following possessed noun."],
              ["donde", "Donde refers to place."],
            ],
            "Qué keeps the accent of the original question.",
          ],
          [
            "who-called",
            "No sabíamos ___ había llamado. (who)",
            "quién",
            [
              ["quien", "An indirect question uses accented quién."],
              ["cuyo", "Cuyo expresses possession and needs a noun."],
              ["donde", "Donde asks about place."],
            ],
            "Quién is accented because it introduces an indirect question.",
          ],
          [
            "how-worked",
            "Preguntaron ___ funcionaba la máquina. (how)",
            "cómo",
            [
              ["como", "The indirect interrogative keeps its accent."],
              ["cuya", "Cuya cannot ask about manner."],
              ["quien", "Quien refers to a person."],
            ],
            "Cómo asks about the machine’s operation in an indirect question.",
          ],
        ],
      ),
      r(
        "reported-requests",
        "Report instructions with the subjunctive",
        "Pedir que and decir que in a directive sense introduce the subjunctive. With a past reporting verb, an imperfect subjunctive commonly expresses the requested action.",
        "me pidió que + imperfect subjunctive; me dijo que no + imperfect subjunctive",
        [
          "Me pidió que esperara. — He/she asked me to wait.",
          "Nos dijo que no saliéramos. — He/she told us not to leave.",
        ],
        ["A reported command differs from a factual statement after dijo que."],
        [
          [
            "wait-request",
            "Use imperfect subjunctive to report a request to me: Me pidió que ___ fuera. (esperar, yo)",
            "esperara",
            [
              ["esperaba", "The request requires subjunctive, not indicative."],
              ["esperaría", "Conditional is not the selected mood."],
              ["esperaras", "The intended subject is yo."],
            ],
            "Esperara reports the requested action of the speaker.",
          ],
          [
            "dont-leave-request",
            "Use imperfect subjunctive: Nos dijo que no ___ . (salir, nosotros; instruction)",
            "saliéramos",
            [
              [
                "salíamos",
                "This would report a fact rather than the instruction.",
              ],
              ["saldríamos", "Conditional is not the required mood."],
              ["salieran", "The subject is nosotros."],
            ],
            "The directive meaning takes saliéramos.",
          ],
          [
            "send-request",
            "Use imperfect subjunctive: La abogada me pidió que le ___ la copia. (enviar, yo)",
            "enviara",
            [
              ["enviaba", "The request selects subjunctive."],
              ["enviaría", "Conditional is not the selected mood."],
              ["enviaran", "The intended subject is yo."],
            ],
            "Pidió que introduces the requested sending with enviara.",
          ],
          [
            "children-quiet",
            "Use imperfect subjunctive: Pidió que los niños ___ silencio. (guardar)",
            "guardaran",
            [
              ["guardaban", "A request takes subjunctive."],
              ["guardarían", "Conditional does not express the selected mood."],
              ["guardara", "Niños is plural."],
            ],
            "Guardaran agrees with los niños in the requested action.",
          ],
          [
            "sign-instruction",
            "Use imperfect subjunctive: Me indicó que ___ en la última página. (firmar, yo; instruction)",
            "firmara",
            [
              [
                "firmaba",
                "The context is an instruction, not a report of fact.",
              ],
              ["firmaría", "Conditional is not the selected mood here."],
              ["firmaras", "The intended subject is yo."],
            ],
            "Firmara reports the instruction given to the speaker.",
          ],
          [
            "bring-request",
            "Use imperfect subjunctive: Nos rogó que ___ los documentos. (traer, nosotros)",
            "trajéramos",
            [
              ["traíamos", "The request takes subjunctive."],
              ["traeríamos", "Conditional is not the selected mood."],
              ["trajeran", "The subject is nosotros."],
            ],
            "Traer uses the preterite stem traj- in trajéramos.",
          ],
        ],
      ),
      r(
        "reported-reference",
        "Adjust person and reference to the reporting moment",
        "Pronouns and expressions of time or place must fit the new speaker and moment. Mañana can become al día siguiente in a later report; aquí may become allí when the report is made elsewhere. These changes depend on the situation.",
        "original yo → reported él / ella; mañana → al día siguiente in a later narrative",
        [
          "Dijo: «Mi coche está aquí». → Dijo que su coche estaba allí (reporting elsewhere).",
          "El lunes dijo: «Voy mañana». → Dijo que iba al día siguiente.",
        ],
        [
          "Time and place words do not change mechanically if the reporting situation stays the same.",
        ],
        [
          [
            "tomorrow-reference",
            "On Friday, report Monday’s «Llegaré mañana» without using a calendar date: Dijo que llegaría ___.",
            "al día siguiente",
            [
              ["mañana", "From Friday, mañana would point to Saturday."],
              ["el día anterior", "That points to the day before Monday."],
              ["dentro de un mes", "That changes the interval to a month."],
            ],
            "Al día siguiente preserves Tuesday as the day after the original Monday statement.",
          ],
          [
            "yesterday-reference",
            "Report later: El jueves dijo «Llegué ayer». Dijo que había llegado ___.",
            "el día anterior",
            [
              [
                "al día siguiente",
                "This would put the arrival after Thursday.",
              ],
              ["dentro de dos días", "This points forward, not backward."],
              ["el mes siguiente", "This changes the time span."],
            ],
            "El día anterior preserves Wednesday as the day before the statement.",
          ],
          [
            "possessive-reference",
            "Eva said «Mi pasaporte está listo». Report about Eva: Dijo que ___ pasaporte estaba listo.",
            "su",
            [
              ["mi", "Mi would make the current reporter the owner."],
              [
                "nuestro",
                "Nuestro changes the owner to a group including the reporter.",
              ],
              ["tus", "Tus is plural and addresses the listener."],
            ],
            "Su refers to Eva as the owner in the third-person report.",
          ],
          [
            "plural-person-reference",
            "Two guides said «Nosotros conocemos la ruta». Report them in third person: Dijeron que ___ conocían la ruta.",
            "ellos",
            [
              [
                "nosotros",
                "This would include the current reporter as subject.",
              ],
              ["yo", "Yo cannot agree with conocían."],
              ["tú", "Tú cannot agree with conocían."],
            ],
            "Ellos keeps the guides as the third-person plural subject.",
          ],
          [
            "here-there-reference",
            "Report from a different city: En Lima dijo «Trabajo aquí». Ahora contamos que trabajaba ___, en Lima.",
            "allí",
            [
              ["aquí", "Aquí would identify the current different city."],
              ["mañana", "Mañana is a time expression, not a location."],
              ["ayer", "Ayer gives time, not place."],
            ],
            "Allí preserves Lima as a location away from the current reporting place.",
          ],
          [
            "own-reflexive-reference",
            "Marta said «Me levanto a las seis». Report Marta in third person: Dijo que ___ levantaba a las seis.",
            "se",
            [
              ["me", "Me would make the reporter the person getting up."],
              ["te", "Te would make the listener the person getting up."],
              ["nos", "Nos would make the speaking group the subject."],
            ],
            "Se agrees in person with Marta as the reported subject.",
          ],
        ],
      ),
    ],
  ),
  c(
    "es-cohesion-variation",
    "Cohesion, register and regional choices",
    "B2",
    S6,
    "Connected Spanish needs clear relationships between ideas and a consistent address system. Regional standards can differ without one being inherently wrong.",
    [
      r(
        "cause-purpose-spelling",
        "Distinguish because, why and the reason",
        "Porque introduces a cause. Por qué introduces a direct or indirect question about a reason. El porqué is a noun meaning the reason and can form a plural, los porqués.",
        "porque = because; por qué = why; el porqué = the reason",
        [
          "No fui porque estaba enferma. — I did not go because I was ill.",
          "No sé por qué cerraron. — I do not know why they closed.",
        ],
        ["Do not remove the accent from an indirect por qué question."],
        [
          [
            "because-ill",
            "No asistí ___ estaba enferma. (because)",
            "porque",
            [
              [
                "por qué",
                "This spelling asks why instead of giving the cause.",
              ],
              ["porqué", "The noun would require a determiner."],
              [
                "por que",
                "This is not the ordinary causal conjunction needed here.",
              ],
            ],
            "Porque introduces the stated cause of not attending.",
          ],
          [
            "why-closed",
            "No sabemos ___ cerraron la carretera. (why)",
            "por qué",
            [
              [
                "porque",
                "That introduces a cause rather than the indirect question.",
              ],
              ["porqué", "The noun would need a determiner here."],
              ["por que", "The interrogative qué needs an accent."],
            ],
            "Por qué keeps the accent in an indirect question.",
          ],
          [
            "reason-noun",
            "Nadie explicó el ___ de la cancelación. (the reason)",
            "porqué",
            [
              ["porque", "The causal conjunction is not the noun."],
              [
                "por qué",
                "This would begin a question rather than name the reason.",
              ],
              ["por que", "This is not the noun meaning reason."],
            ],
            "After el, porqué is a noun meaning the reason.",
          ],
          [
            "direct-why",
            "¿___ has cambiado de opinión? (Why?)",
            "Por qué",
            [
              [
                "Porque",
                "Porque introduces an answer or cause, not the intended question word.",
              ],
              ["Porqué", "The noun would require a determiner."],
              ["Por que", "The interrogative requires the accent."],
            ],
            "Por qué asks directly for the reason.",
          ],
          [
            "reason-plural",
            "Quiero entender los ___ de esta decisión. (the reasons)",
            "porqués",
            [
              ["porques", "The noun keeps its written accent in the plural."],
              ["por qués", "The plural noun is one word."],
              [
                "porque",
                "Porque is an invariable conjunction, not the plural noun.",
              ],
            ],
            "Los porqués is the plural noun meaning the reasons.",
          ],
          [
            "because-broken",
            "No pudimos imprimir ___ la impresora estaba averiada. (because)",
            "porque",
            [
              ["porqué", "A noun does not introduce the causal clause here."],
              ["por qué", "The sentence supplies a cause, not a question."],
              [
                "por que",
                "The ordinary causal conjunction is written as one word.",
              ],
            ],
            "Porque gives the cause of the printing problem.",
          ],
        ],
      ),
      r(
        "contrast-consequence",
        "Mark contrast, correction and consequence",
        "Pero introduces contrast. Sino corrects a negated alternative and normally needs que before a finite clause. Por eso gives a consequence. A pesar de can precede a noun or infinitive; a pesar de que introduces a finite clause.",
        "no X, sino Y; no hizo X, sino que hizo Y; por eso + result",
        [
          "No es azul, sino verde. — It is not blue but green.",
          "Estaba cerrado; por eso volvimos. — It was closed, so we went back.",
        ],
        ["Do not use sino to introduce an open if not condition."],
        [
          [
            "color-correction",
            "No es azul, ___ verde. (correction)",
            "sino",
            [
              ["si no", "Si no introduces a condition meaning if not."],
              ["porque", "Porque gives a cause, not a correction."],
              ["por eso", "Por eso gives a consequence."],
            ],
            "Sino replaces a rejected alternative with the correct one.",
          ],
          [
            "action-correction",
            "No llamó, ___ envió un mensaje. (not X but instead Y)",
            "sino que",
            [
              ["sino", "A new finite clause after sino needs que here."],
              ["si no", "Si no introduces an if-not condition."],
              ["por qué", "Por qué asks a reason."],
            ],
            "Sino que introduces the correcting finite clause.",
          ],
          [
            "result-delay",
            "El tren se averió; ___ llegamos tarde. (as a result)",
            "por eso",
            [
              [
                "sin embargo",
                "Sin embargo marks contrast rather than the stated result.",
              ],
              [
                "a pesar de",
                "A pesar de cannot directly introduce this finite result clause.",
              ],
              ["sino", "Sino corrects a negated alternative."],
            ],
            "Por eso links the breakdown to its consequence.",
          ],
          [
            "despite-rain",
            "Salimos a pasear a pesar ___ la lluvia.",
            "de",
            [
              ["que", "A noun follows, so the expression is a pesar de."],
              ["a", "A pesar a is not the expression."],
              ["por", "A pesar por is not the expression."],
            ],
            "A pesar de introduces the noun phrase la lluvia.",
          ],
          [
            "despite-clause",
            "Continuó a pesar de ___ estaba cansada.",
            "que",
            [
              ["si", "The concessive expression is a pesar de que."],
              ["por", "Por does not introduce the finite clause here."],
              ["a", "A does not complete the expression."],
            ],
            "A pesar de que introduces a finite concessive clause.",
          ],
          [
            "if-not",
            "___ reservas hoy, quizá no queden plazas. (If you do not book)",
            "Si no",
            [
              ["Sino", "Sino corrects a prior negated alternative."],
              [
                "Porque",
                "Porque would give a cause rather than the stated condition.",
              ],
              [
                "Por eso",
                "Por eso would introduce a result, not the condition.",
              ],
            ],
            "Si no is written as two words when it introduces if not.",
          ],
        ],
      ),
      r(
        "reference-ellipsis",
        "Keep references clear and grammatical",
        "Reference words and agreement help readers follow a text. Ellipsis can avoid repetition when the omitted material is recoverable. Neuter lo can represent an adjective or an entire idea rather than a masculine noun.",
        "una…otra; uno…otro; lo está; lo entiendo; también / tampoco",
        [
          "¿Está lista? Sí, lo está. — Is she ready? Yes, she is.",
          "Yo no fui; ella tampoco. — I did not go; she did not either.",
        ],
        [
          "Lo representing an attribute stays neuter even with a feminine subject.",
        ],
        [
          [
            "attribute-ready",
            "¿Está lista la directora? Sí, ___ está.",
            "lo",
            [
              [
                "la",
                "The repeated attribute lista is represented by neuter lo.",
              ],
              ["las", "The attribute replacement is not plural."],
              ["le", "Le would mark an indirect object, not the attribute."],
            ],
            "Neuter lo stands for the attribute lista.",
          ],
          [
            "negative-agreement",
            "Yo no pude ir; Clara ___ . (neither could Clara)",
            "tampoco",
            [
              ["también", "También would express positive addition."],
              ["sí", "Sí would assert that Clara could go."],
              ["siempre", "Siempre means always, not neither."],
            ],
            "Tampoco adds another negative statement.",
          ],
          [
            "positive-addition",
            "Luis ha terminado y yo ___ . (so have I)",
            "también",
            [
              ["tampoco", "Tampoco adds a negative statement."],
              ["nunca", "Nunca means never."],
              [
                "nadie",
                "Nadie is a person pronoun, not the required additive adverb.",
              ],
            ],
            "También adds the speaker to the positive statement.",
          ],
          [
            "another-feminine",
            "Una taza está rota; la ___ está intacta.",
            "otra",
            [
              ["otro", "Taza is feminine."],
              ["otros", "The omitted noun is feminine singular."],
              ["otras", "Only one remaining cup is indicated."],
            ],
            "Otra agrees with the omitted feminine singular taza.",
          ],
          [
            "another-masculine",
            "Un billete es para ti; el ___ es para mí.",
            "otro",
            [
              ["otra", "Billete is masculine."],
              ["otros", "The omitted noun is singular."],
              ["otras", "The omitted noun is masculine singular."],
            ],
            "Otro agrees with the omitted noun billete.",
          ],
          [
            "whole-idea",
            "Que no puedas venir, ___ entiendo.",
            "lo",
            [
              ["la", "The whole proposition takes neuter lo."],
              ["los", "The reference is an idea, not plural masculine things."],
              ["le", "Le does not represent a direct-object proposition."],
            ],
            "Lo refers to the whole idea that you cannot come.",
          ],
        ],
      ),
      r(
        "regional-register",
        "Keep address and regional choices consistent",
        "Ustedes uses third-person plural verbs. Vosotros takes second-person plural forms and is usual for familiar plural address in much of Spain. Voseo is standard in many regions; its forms vary. A course must specify the target system instead of rejecting another standard variety.",
        "ustedes hablan; vosotros habláis; vos hablás in Rioplatense present indicative",
        [
          "Ustedes tienen la llave. — You have the key (plural).",
          "Vos hablás muy claro. — You speak very clearly (Rioplatense voseo).",
        ],
        [
          "Regional frequency does not make another standard form ungrammatical.",
        ],
        [
          [
            "ustedes-agreement",
            "Using ustedes: Ustedes ___ la dirección.",
            "tienen",
            [
              ["tenéis", "Tenéis belongs to vosotros, not ustedes."],
              ["tienes", "Tienes belongs to tú."],
              ["tenemos", "Tenemos belongs to nosotros."],
            ],
            "Ustedes takes third-person plural tienen.",
          ],
          [
            "vosotros-agreement",
            "Using vosotros: Vosotros ___ español.",
            "habláis",
            [
              ["hablan", "Hablan belongs to ellos/ustedes."],
              ["hablas", "Hablas belongs to tú."],
              ["hablamos", "Hablamos belongs to nosotros."],
            ],
            "Vosotros takes the second-person plural habláis.",
          ],
          [
            "rioplatense-vos",
            "Use Rioplatense voseo present indicative: Vos ___ muy rápido. (hablar)",
            "hablás",
            [
              ["habláis", "Habláis is a vosotros form, not this voseo form."],
              ["hablan", "Hablan is third-person plural."],
              ["hablamos", "Hablamos is first-person plural."],
            ],
            "Rioplatense vos commonly uses hablás.",
          ],
          [
            "respectful-singular",
            "Address one person as usted: ¿___ ayuda?",
            "Necesita",
            [
              ["Necesitas", "Necesitas belongs to tú."],
              ["Necesitáis", "Necesitáis belongs to vosotros."],
              ["Necesitan", "Necesitan is plural, not singular usted."],
            ],
            "Usted uses third-person singular necesita.",
          ],
          [
            "regional-validity",
            "For familiar plural address, vosotros habláis in much of Spain and ustedes hablan in most of the Americas are ___.",
            "both standard regional choices",
            [
              [
                "evidence that only Spain has grammatical Spanish",
                "Both address systems are standard in their regions.",
              ],
              [
                "always interchangeable without changing the verb",
                "Each pronoun requires its own agreement.",
              ],
              [
                "both singular address forms",
                "Both expressions address more than one person.",
              ],
            ],
            "The two plural address systems are standard; agreement must match the chosen pronoun.",
          ],
          [
            "plural-request",
            "Using ustedes for a polite group instruction: Por favor, ___ aquí.",
            "esperen",
            [
              ["esperad", "Esperad belongs to vosotros."],
              ["espera", "Espera addresses tú."],
              ["esperas", "Esperas is tú indicative."],
            ],
            "Ustedes takes the command esperen.",
          ],
        ],
      ),
    ],
  ),
];
