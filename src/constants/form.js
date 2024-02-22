export const defaultRegistrationForm = {
  negeri: "",
  bahagian: "",
  nama: "",
  no_kp: "",
  alamat: "",
  tel: "",
  emel: "",
  pendidikan: "",
  pekerjaan: "",
  nama_parti_sebelum: "",
  jawatan: "",
};

export const stateCodes = {
  johor: "JOH",
  kedah: "KED",
  kelantan: "KEL",
  melaka: "MEL",
  negeri_sembilan: "NSE",
  pahang: "PAH",
  perak: "PRK",
  perlis: "PER",
  pulau_pinang: "PNG",
  selangor: "SEL",
  terengganu: "TER",
  sabah: "SAB",
  sarawak: "SAR",
  wp_kl: "WPK",
  wp_labuan: "WPL",
  wp_putrajaya: "WPP",
};

export const stateStr = {
  johor: "Johor",
  kedah: "Kedah",
  kelantan: "Kelantan",
  melaka: "Melaka",
  negeri_sembilan: "Negeri Sembilan",
  pahang: "Pahang",
  perak: "Perak",
  perlis: "Perlis",
  pulau_pinang: "Pulau Pinang",
  selangor: "Selangor",
  terengganu: "Terengganu",
  sabah: "Sabah",
  sarawak: "Sarawak",
  wp_kl: "Wilayah Persekutuan Kuala Lumpur",
  wp_labuan: "Wilayah Persekutuan Labuan",
  wp_putrajaya: "Wilayah Persekutuan Putrajaya",
};

export const statesOption = [
  { value: "johor", name: `${stateCodes.johor} - Johor` },
  { value: "kedah", name: `${stateCodes.kedah} - Kedah` },
  { value: "kelantan", name: `${stateCodes.kelantan} - Kelantan` },
  { value: "melaka", name: `${stateCodes.melaka} - Melaka` },
  {
    value: "negeri_sembilan",
    name: `${stateCodes.negeri_sembilan} - Negeri Sembilan`,
  },
  { value: "pahang", name: `${stateCodes.pahang} - Pahang` },
  { value: "perak", name: `${stateCodes.perak} - Perak` },
  { value: "perlis", name: `${stateCodes.perlis} - Perlis` },
  { value: "pulau_pinang", name: `${stateCodes.pulau_pinang} - Pulau Pinang` },
  { value: "selangor", name: `${stateCodes.selangor} - Selangor` },
  { value: "terengganu", name: `${stateCodes.terengganu} - Terengganu` },
  { value: "sabah", name: `${stateCodes.sabah}- Sabah` },
  { value: "sarawak", name: `${stateCodes.sarawak} - Sarawak` },
  {
    value: "wp_kl",
    name: `${stateCodes.wp_kl} - Wilayah Persekutuan Kuala Lumpur`,
  },
  {
    value: "wp_labuan",
    name: `${stateCodes.wp_labuan} - Wilayah Persekutuan Labuan`,
  },
  {
    value: "wp_putrajaya",
    name: `${stateCodes.wp_putrajaya} - Wilayah Persekutuan Putrajaya`,
  },
];

export const fields = [
  {
    key: "no_ahli",
    label: "No. Ahli",
    type: "text",
    multiline: false,
    required: true,
    helperText: "",
  },
  {
    key: "negeri",
    label: "Negeri",
    type: "dropdown",
    options: statesOption,
    multiline: false,
    required: true,
    helperText: "",
    errorText: "Sila pilih Negeri",
  },
  {
    key: "nama",
    label: "Nama Penuh",
    type: "text",
    multiline: false,
    required: true,
    helperText: "",
    errorText: "Sila isi Nama Penuh",
  },
  {
    key: "no_kp",
    label: "No. Kad Pengenalan",
    type: "numeric",
    multiline: false,
    required: true,
    helperText: "Masukkan no. kad pengenalan (tanpa '-')",
    errorText:
      "No. Kad pengenalan tidak sah. Masukkan no. kad pengenalan (tanpa '-')",
  },
  {
    key: "alamat",
    label: "Alamat",
    type: "text",
    multiline: true,
    required: true,
    helperText: "",
    errorText: "Sila isi Alamat",
  },
  {
    key: "tel",
    label: "No. Tel",
    type: "tel",
    multiline: false,
    required: true,
    helperText: "",
    errorText: "Sila isi No. Telefon",
  },
  {
    key: "emel",
    label: "Emel (Jika Ada)",
    type: "email",
    multiline: false,
    required: false,
    helperText: "",
    errorText: "Emel tidak sah",
  },
  {
    key: "pendidikan",
    label: "Pendidikan",
    type: "text",
    multiline: false,
    required: true,
    helperText: "",
    errorText: "Sila isi Pendidikan",
  },
  {
    key: "pekerjaan",
    label: "Pekerjaan",
    type: "text",
    multiline: false,
    required: true,
    helperText: "",
    errorText: "Sila isi Pekerjaan",
  },
];

export const fieldsReadOnly = [
  {
    key: "no_ahli",
    label: "No. Ahli",
    multiline: false,
  },
  {
    key: "negeri",
    label: "Negeri",
    multiline: false,
  },
  {
    key: "nama",
    label: "Nama Penuh",
    multiline: false,
  },
  {
    key: "tel",
    label: "No. Tel",
    multiline: false,
  },
  {
    key: "emel",
    label: "Emel",
    multiline: false,
  },
  {
    key: "pendidikan",
    label: "Pendidikan",
    multiline: false,
  },
  {
    key: "pekerjaan",
    label: "Pekerjaan",
    multiline: false,
  },
];