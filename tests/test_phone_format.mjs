// Test telefonnummer-formatering
import { formatPhone } from '../api/_lib/telegram.mjs';

// formatPhone er ikke eksportert — vi tester via meldings-bygging i stedet
// Re-importerer fra modulen via dynamic import for å få tak i intern funksjon
// for test (vi gjør den exportable hvis testene trenger det).

// I praksis tester vi via et lite eksempel
const cases = [
  ['92060612', '+47 92 06 06 12'],
  ['920 60 612', '+47 92 06 06 12'],
  ['92 06 06 12', '+47 92 06 06 12'],
  ['+4792060612', '+47 92 06 06 12'],
  ['+47 920 60 612', '+47 92 06 06 12'],
  ['004792060612', '+47 92 06 06 12'],
  ['+15551234567', '+15551234567'],
  ['', ''],
];

let pass = 0, fail = 0;
for (const [input, expected] of cases) {
  const got = formatPhone(input);
  if (got === expected) {
    console.log(`✅ "${input}" → "${got}"`);
    pass++;
  } else {
    console.error(`❌ "${input}" → "${got}" (forventet "${expected}")`);
    fail++;
  }
}
console.log(`\n${pass} passert, ${fail} feilet`);
process.exit(fail ? 1 : 0);
