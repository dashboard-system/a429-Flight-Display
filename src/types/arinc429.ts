// ARINC 429 Word Class
export class ARINC429Word {
  label: number;
  sdi: number;
  data: number;
  ssm: number;
  parity: number;

  constructor(label: number, sdi: number, data: number, ssm: number) {
    this.label = label;
    this.sdi = sdi;
    this.data = data;
    this.ssm = ssm;
    this.parity = this.calculateParity();
  }

  calculateParity(): number {
    const word = (this.label << 24) | (this.sdi << 22) | (this.data << 3) | (this.ssm << 1);
    let bits = 0;
    for (let i = 0; i < 31; i++) {
      if (word & (1 << i)) bits++;
    }
    return bits % 2 === 0 ? 1 : 0;
  }
}

// ARINC 429 Labels
export const ARINC429_LABELS = {
  ALTITUDE: 0o203,
  AIRSPEED: 0o206,
  MACH: 0o207,
  HEADING: 0o222,
  VERTICAL_SPEED: 0o365,
  PITCH: 0o324,
  ROLL: 0o325,
  TEMPERATURE: 0o211,
} as const;

export const SSM = {
  NORMAL_OPERATION: 0b11
} as const;