# Native repository extraction — September 26, 2026

Source web revision: `c4794c5709001ca81d01a545f974ee819508b38c`.
Mobile subtree split: `8acf808c63235cf875761d83074792ad0f879088`.
Destination local checkout: `../grammacho-mobile`, branch `codex/native-extraction`.

The exact mobile tree was verified against the standalone history before removal. Four required pure modules (curriculum, learning constants, grammar types and quiz helpers) are now frozen under the native repository's `src/grammar`. Metro, Babel, Jest and TypeScript resolve locally. Frozen installation, TypeScript and an offline curriculum/practice test pass there. No native device build or educator review is implied.

No hosted repository was created or pushed. Choose/create the native remote, publish the reviewed history, then register that verified remote in the workspace catalog. The historical infrastructure guide remains here as provenance; current native setup instructions live in the extracted README.
