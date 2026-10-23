"""Party name normalisation, display names, colours and lineage."""
import re, csv, hashlib, os

HERE = os.path.dirname(__file__)

# raw code synonyms -> canonical code
SYN = {
    'CPM': 'CPI(M)', 'CPIM': 'CPI(M)', 'CPI(M)': 'CPI(M)', 'CPI-M': 'CPI(M)',
    'CPI(ML)(L)': 'CPIML', 'CPI(M)(L)': 'CPIML', 'CPI(ML)L': 'CPIML', 'CPI(ML)': 'CPIML', 'CPIMLL': 'CPIML',
    'CPI(ML) LIBERATION': 'CPIML',
    'TMC': 'AITC', 'AITMC': 'AITC', 'AIT C': 'AITC', 'TMC(M)': 'AITC',
    'ADMK': 'AIADMK', 'AIDMK': 'AIADMK',
    'JD(U)': 'JDU', 'JDU': 'JDU', 'JD(S)': 'JDS', 'JDS': 'JDS',
    'SHS(UBT)': 'SSUBT', 'SS(UBT)': 'SSUBT', 'SHSUBT': 'SSUBT', 'SHIVSENA(UBT)': 'SSUBT',
    'SHS': 'SHS', 'SS': 'SHS_SHINDE',
    'NCP(SP)': 'NCPSP', 'NCP-SP': 'NCPSP', 'NCPSP': 'NCPSP', 'NCP(SCP)': 'NCPSP',
    'TRS': 'BRS', 'BRS': 'BRS',
    'YSRCP': 'YSRCP', 'YSRC': 'YSRCP', 'YSR': 'YSRCP',
    'ADAL': 'ADS', 'AD(S)': 'ADS', 'ADS': 'ADS', 'APNA DAL (SONEYLAL)': 'ADS',
    'LJP(RV)': 'LJPRV', 'LJPRV': 'LJPRV',
    'HAM(S)': 'HAMS', 'HAMS': 'HAMS', 'HAM': 'HAMS',
    'JKN': 'JKNC', 'JKNC': 'JKNC', 'JKPDP': 'JKPDP', 'PDP': 'JKPDP',
    'AIMIM': 'AIMIM', 'MIM': 'AIMIM',
    'JKNPP': 'JKNPP',
    'IND': 'IND', 'INDEPENDENT': 'IND',
    'NOTA': 'NOTA',
    'KEC(M)': 'KCM', 'KC(M)': 'KCM', 'KCM': 'KCM', 'KEC': 'KEC',
    'MUL': 'IUML', 'IUML': 'IUML',
    'BJS': 'BJS', 'JNP': 'JNP', 'JNP(S)': 'JNPS',
    'INC(I)': 'INC', 'INC(U)': 'INCU', 'ICS': 'ICS', 'INC(O)': 'NCO', 'NCO': 'NCO', 'INC(R)': 'INC',
    'BLD': 'BLD', 'JD': 'JD',
    'RLSP': 'RLM', 'RLM': 'RLM', 'RLSM': 'RLM',
    'NDPP': 'NDPP', 'NPF': 'NPF', 'NPEP': 'NPP', 'NPP': 'NPP',
    'AINRC': 'AINRC', 'AINRCONG': 'AINRC',
    'TVK': 'TVK', 'NTK': 'NTK', 'DMDK': 'DMDK', 'MDMK': 'MDMK', 'VCK': 'VCK', 'PMK': 'PMK',
    'BHJP': 'BJP', 'BJP': 'BJP', 'INC': 'INC',
}

# full name (lowercased, simplified) -> code
NAME2CODE = {}

def _simp(s):
    s = s.lower().replace('’', "'").replace('&', 'and')
    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r"[^a-z0-9() ]", '', s)
    return s.strip()

MANUAL_NAMES = {
    'bharatiya janata party': 'BJP', 'bhartiya janata party': 'BJP',
    'indian national congress': 'INC', 'aam aadmi party': 'AAP',
    'all india trinamool congress': 'AITC', 'trinamool congress': 'AITC',
    'samajwadi party': 'SP', 'bahujan samaj party': 'BSP',
    'dravida munnetra kazhagam': 'DMK', 'all india anna dravida munnetra kazhagam': 'AIADMK',
    'telugu desam': 'TDP', 'telugu desam party': 'TDP',
    'yuvajana sramika rythu congress party': 'YSRCP', 'ysr congress party': 'YSRCP',
    'janata dal (united)': 'JDU', 'janata dal (secular)': 'JDS',
    'rashtriya janata dal': 'RJD', 'shiv sena': 'SHS',
    'shiv sena (uddhav balasaheb thackrey)': 'SSUBT', 'shiv sena (uddhav balasaheb thackeray)': 'SSUBT',
    'nationalist congress party': 'NCP', 'nationalist congress party  sharadchandra pawar': 'NCPSP',
    'nationalist congress party sharadchandra pawar': 'NCPSP',
    'communist party of india (marxist)': 'CPI(M)', 'communist party of india': 'CPI',
    'communist party of india (marxistleninist) (liberation)': 'CPIML',
    'communist party of india (marxistleninist) liberation': 'CPIML',
    'communist party of india (marxist leninist) (liberation)': 'CPIML',
    'biju janata dal': 'BJD', 'jharkhand mukti morcha': 'JMM',
    'telangana rashtra samithi': 'BRS', 'bharat rashtra samithi': 'BRS',
    'all india majliseittehadul muslimeen': 'AIMIM', 'all india majlisittehadul muslimeen': 'AIMIM',
    'indian union muslim league': 'IUML', 'shiromani akali dal': 'SAD',
    'indian national lok dal': 'INLD', 'jannayak janta party': 'JJP',
    'asom gana parishad': 'AGP', 'all india united democratic front': 'AIUDF',
    'bodoland peoples front': 'BPF', 'united peoples party liberal': 'UPPL',
    'national peoples party': 'NPP', 'naga peoples front': 'NPF',
    'nationalist democratic progressive party': 'NDPP', 'mizo national front': 'MNF',
    'zoram peoples movement': 'ZPM', 'sikkim krantikari morcha': 'SKM', 'sikkim democratic front': 'SDF',
    'jammu and kashmir national conference': 'JKNC', 'jammu and kashmir peoples democratic party': 'JKPDP',
    'jammu and kashmir national panthers party': 'JKNPP', 'jammu and kashmir peoples conference': 'JKPC',
    'lok jan shakti party': 'LJP', 'lok janshakti party': 'LJP', 'lok janshakti party(ram vilas)': 'LJPRV',
    'lok janshakti party (ram vilas)': 'LJPRV',
    'hindustani awam morcha (secular)': 'HAMS', 'hindustani awam morcha': 'HAMS',
    'vikassheel insaan party': 'VIP', 'rashtriya lok samta party': 'RLM', 'rashtriya lok morcha': 'RLM',
    'rashtriya lok dal': 'RLD', 'apna dal (soneylal)': 'ADS', 'apna dal (kamerawadi)': 'ADK',
    'suheldev bharatiya samaj party': 'SBSP', 'nishad party': 'NISHAD',
    'nirbal indian shoshit hamara aam dal': 'NISHAD',
    'all jharkhand students union': 'AJSU', 'jharkhand vikas morcha (prajatantrik)': 'JVM',
    'jharkhand loktantrik krantikari morcha': 'JLKM',
    'maharashtra navnirman sena': 'MNS', 'vanchit bahujan aaghadi': 'VBA', 'vanchit bahujan aghadi': 'VBA',
    'peasants and workers party of india': 'PWPI', 'bahujan vikas aaghadi': 'BVA',
    'kerala congress (m)': 'KCM', 'revolutionary socialist party': 'RSP', 'all india forward bloc': 'AIFB',
    'pattali makkal katchi': 'PMK', 'desiya murpokku dravida kazhagam': 'DMDK',
    'marumalarchi dravida munnetra kazhagam': 'MDMK', 'viduthalai chiruthaigal katchi': 'VCK',
    'naam tamilar katchi': 'NTK', 'tamilaga vettri kazhagam': 'TVK', 'makkal needhi maiam': 'MNM',
    'all india nr congress': 'AINRC', 'janasena party': 'JSP', 'jana sena party': 'JSP',
    'jan suraaj party': 'JSURAJ', 'indigenous peoples front of tripura': 'IPFT',
    'tipra motha party': 'TIPRA', 'united democratic party': 'UDP', 'voice of the people party': 'VPP',
    'hill state peoples democratic party': 'HSPDP', 'peoples democratic front': 'PDF',
    'rashtriya loktantrik party': 'RLTP', 'bharat adivasi party': 'BAP', 'bharatiya tribal party': 'BTP',
    'janta congress chhattisgarh (j)': 'JCCJ', 'gondvana gantantra party': 'GGP',
    'azad samaj party (kanshi ram)': 'ASPKR', 'aazad samaj party (kanshi ram)': 'ASPKR',
    'peoples party of arunachal': 'PPA', 'citizen action party sikkim': 'CAPS',
    'haryana janhit congress (bl)': 'HJC', 'haryana lokhit party': 'HLP',
    'gujarat parivartan party': 'GPP', 'rashtriya samaj paksha': 'RSPS',
    'prahar janshakti party': 'PJP', 'swabhimani paksha': 'SWP', 'jan surajya shakti': 'JSS',
    'krantikari shetkari party': 'KSP', 'marxist coordination committee': 'MCC', 'jharkhand party': 'JKP',
    'jai bharat samanta party': 'JBSP', 'nav jawan sangharsh morcha': 'NJSM', 'samata kranti dal': 'SKD',
    'garo national council': 'GNC', 'khun hynniewtrep national awakening movement': 'KHNAM',
    'republican party of india (athawale)': 'RPIA', 'himachal lokhit party': 'HLP',
    'rashtriya devbhumi party': 'RDP', 'assam jatiya parishad': 'AJP', 'raijor dal': 'RD',
    'aam janata unnayan party': 'AJUP', 'all india secular front': 'AISF', 'indian secular front': 'AISF',
    'independent': 'IND', 'independents': 'IND', 'independent politician': 'IND',
    'none of the above': 'NOTA', 'nota': 'NOTA', 'none of the above (nota)': 'NOTA',
    'kerala congress': 'KEC', 'kerala congress (joseph)': 'KECJ',
    'shiromani akali dal (sanyukt)': 'SADS', 'punjab lok congress party': 'PLC',
    'lok insaaf party': 'LIP', 'bharatiya jana sangh': 'BJS', 'bharatiya jan sangh': 'BJS',
    'janata party': 'JNP', 'janata dal': 'JD', 'swatantra party': 'SWA', 'praja socialist party': 'PSP',
    'samyukta socialist party': 'SSP', 'kisan mazdoor praja party': 'KMPP', 'socialist party': 'SOC',
    'bharatiya lok dal': 'BLD', 'indian national congress (organisation)': 'NCO',
    'tamil maanila congress (moopanar)': 'TMC(M)',
    'akhil bharatiya hindu mahasabha': 'HMS',
}

DISPLAY = {
    'BJP': 'Bharatiya Janata Party', 'INC': 'Indian National Congress', 'AAP': 'Aam Aadmi Party',
    'AITC': 'All India Trinamool Congress', 'SP': 'Samajwadi Party', 'BSP': 'Bahujan Samaj Party',
    'DMK': 'Dravida Munnetra Kazhagam', 'AIADMK': 'AIADMK', 'TDP': 'Telugu Desam Party',
    'YSRCP': 'YSR Congress Party', 'JDU': 'Janata Dal (United)', 'JDS': 'Janata Dal (Secular)',
    'RJD': 'Rashtriya Janata Dal', 'SHS': 'Shiv Sena', 'SHS_SHINDE': 'Shiv Sena (Shinde)',
    'SSUBT': 'Shiv Sena (UBT)', 'NCP': 'Nationalist Congress Party', 'NCPSP': 'NCP (Sharadchandra Pawar)',
    'CPI(M)': 'CPI (Marxist)', 'CPI': 'Communist Party of India', 'CPIML': 'CPI (ML) Liberation',
    'BJD': 'Biju Janata Dal', 'JMM': 'Jharkhand Mukti Morcha', 'BRS': 'Bharat Rashtra Samithi (TRS)',
    'AIMIM': 'AIMIM', 'IUML': 'Indian Union Muslim League', 'SAD': 'Shiromani Akali Dal',
    'INLD': 'Indian National Lok Dal', 'JJP': 'Jannayak Janta Party', 'AGP': 'Asom Gana Parishad',
    'AIUDF': 'AIUDF', 'BPF': 'Bodoland People\'s Front', 'UPPL': 'UPPL', 'NPP': 'National People\'s Party',
    'NPF': 'Naga People\'s Front', 'NDPP': 'NDPP', 'MNF': 'Mizo National Front', 'ZPM': 'Zoram People\'s Movement',
    'SKM': 'Sikkim Krantikari Morcha', 'SDF': 'Sikkim Democratic Front', 'JKNC': 'J&K National Conference',
    'JKPDP': 'J&K PDP', 'LJP': 'Lok Janshakti Party', 'LJPRV': 'LJP (Ram Vilas)', 'HAMS': 'HAM (Secular)',
    'VIP': 'Vikassheel Insaan Party', 'RLM': 'Rashtriya Lok Morcha (RLSP)', 'RLD': 'Rashtriya Lok Dal',
    'ADS': 'Apna Dal (Soneylal)', 'SBSP': 'SBSP', 'NISHAD': 'NISHAD Party', 'AJSU': 'AJSU Party',
    'JVM': 'Jharkhand Vikas Morcha', 'JLKM': 'JLKM', 'MNS': 'Maharashtra Navnirman Sena',
    'VBA': 'Vanchit Bahujan Aghadi', 'KCM': 'Kerala Congress (M)', 'RSP': 'Revolutionary Socialist Party',
    'AIFB': 'All India Forward Bloc', 'PMK': 'Pattali Makkal Katchi', 'DMDK': 'DMDK', 'MDMK': 'MDMK',
    'VCK': 'VCK', 'NTK': 'Naam Tamilar Katchi', 'TVK': 'Tamilaga Vettri Kazhagam', 'AINRC': 'AINRC',
    'JSP': 'Jana Sena Party', 'JSURAJ': 'Jan Suraaj Party', 'IPFT': 'IPFT', 'TIPRA': 'Tipra Motha',
    'UDP': 'United Democratic Party', 'VPP': 'Voice of the People Party', 'IND': 'Independents',
    'OTH': 'Others', 'NOTA': 'NOTA', 'BJS': 'Bharatiya Jana Sangh', 'JNP': 'Janata Party', 'JD': 'Janata Dal',
    'SWA': 'Swatantra Party', 'PSP': 'Praja Socialist Party', 'SSP': 'Samyukta Socialist Party',
    'KMPP': 'Kisan Mazdoor Praja Party', 'SOC': 'Socialist Party', 'BLD': 'Bharatiya Lok Dal',
    'NCO': 'Congress (O)', 'JNPS': 'Janata Party (Secular)', 'ICS': 'Congress (Socialist)', 'INCU': 'Congress (U)',
    'HMS': 'Hindu Mahasabha', 'BAP': 'Bharat Adivasi Party', 'RLTP': 'Rashtriya Loktantrik Party',
    'JCCJ': 'JCC (J)', 'ASPKR': 'Azad Samaj Party', 'PPA': 'People\'s Party of Arunachal', 'HJC': 'HJC (BL)',
    'AJUP': 'Aam Janata Unnayan Party', 'AISF': 'Indian Secular Front', 'JKPC': 'J&K People\'s Conference',
    'JKNPP': 'J&K Panthers Party', 'CAPS': 'Citizen Action Party', 'HSPDP': 'HSPDP', 'PDF': 'PDF',
    'TMC(M)': 'Tamil Maanila Congress',
}

COLORS = {
    'BJP': '#F28C28', 'INC': '#1f77b4', 'AAP': '#1B9BB0', 'AITC': '#2EAD4B', 'SP': '#D7263D',
    'BSP': '#2A3B90', 'DMK': '#B71C1C', 'AIADMK': '#2E7D32', 'TDP': '#F2C500', 'YSRCP': '#1565C0',
    'JDU': '#2E8B57', 'JDS': '#3C8D2F', 'RJD': '#0C6E3A', 'SHS': '#F06A1E', 'SHS_SHINDE': '#E2541A',
    'SSUBT': '#C24A12', 'NCP': '#00A6A6', 'NCPSP': '#5C3C92', 'CPI(M)': '#C1121F', 'CPI': '#E53935',
    'CPIML': '#8E0E00', 'BJD': '#3F8F29', 'JMM': '#1E7B34', 'BRS': '#E05297', 'AIMIM': '#136B3A',
    'IUML': '#1D6F42', 'SAD': '#0E3A8A', 'INLD': '#2D7E3E', 'JJP': '#F4B400', 'AGP': '#3B82C4',
    'AIUDF': '#2F9E44', 'BPF': '#A7C957', 'UPPL': '#E8A33D', 'NPP': '#E8C547', 'NPF': '#7B2CBF',
    'NDPP': '#D95D39', 'MNF': '#0B6E4F', 'ZPM': '#E9A13B', 'SKM': '#C9184A', 'SDF': '#F4D35E',
    'JKNC': '#C1272D', 'JKPDP': '#0B6623', 'LJP': '#3E5C9A', 'LJPRV': '#6F42C1', 'HAMS': '#8A2BE2',
    'VIP': '#6A994E', 'RLM': '#9C6644', 'RLD': '#006400', 'ADS': '#D63384', 'SBSP': '#F7B801',
    'NISHAD': '#4E9F3D', 'AJSU': '#D9A400', 'JVM': '#7D5BA6', 'JLKM': '#8D99AE', 'MNS': '#FF9F1C',
    'VBA': '#4361EE', 'KCM': '#E07A5F', 'RSP': '#BC4749', 'AIFB': '#9D0208', 'PMK': '#E9C46A',
    'DMDK': '#A68A64', 'MDMK': '#C1666B', 'VCK': '#4A4E69', 'NTK': '#9B2226', 'TVK': '#E4002B',
    'AINRC': '#D4A017', 'JSP': '#D00000', 'JSURAJ': '#F6AE2D', 'IPFT': '#2F4858', 'TIPRA': '#E85D04',
    'UDP': '#3A86FF', 'VPP': '#7209B7', 'IND': '#8A8F98', 'OTH': '#B9BDC4', 'NOTA': '#5f6368',
    'BJS': '#E68A00', 'JNP': '#2B9348', 'JD': '#3D9970', 'SWA': '#5E548E', 'PSP': '#9E2A2B',
    'SSP': '#B5179E', 'KMPP': '#6D597A', 'SOC': '#A23E48', 'BLD': '#55A630', 'NCO': '#4895EF',
    'JNPS': '#80B918', 'ICS': '#72A1E5', 'INCU': '#5390D9', 'BAP': '#F15BB5', 'RLTP': '#00BBF9',
    'JCCJ': '#E76F51', 'ASPKR': '#264653', 'PPA': '#2A9D8F', 'HJC': '#B56576', 'AJUP': '#06D6A0',
    'AISF': '#118AB2', 'JKPC': '#073B4C', 'JKNPP': '#EF476F', 'CAPS': '#FFB703', 'TMC(M)': '#69B34C',
}

PALETTE = ['#6C5B7B', '#C06C84', '#355C7D', '#99B898', '#E84A5F', '#2A363B', '#A8A7A7', '#CC527A',
           '#474747', '#45ADA8', '#9DE0AD', '#547980', '#F9CDAD', '#83AF9B', '#C8C8A9', '#FE4365']

# successor -> predecessor (for building approximate seats)
LINEAGE = {
    'SSUBT': 'SHS', 'SHS_SHINDE': 'SHS', 'NCPSP': 'NCP', 'JJP': 'INLD', 'LJPRV': 'LJP',
    'RLM': 'RLM', 'HAMS': 'HAMS', 'JLKM': 'AJSU', 'TIPRA': 'IPFT', 'ZPM': 'MNF',
}


def load_ls_names():
    p = os.path.join(HERE, 'ls_party_names.csv')
    if not os.path.exists(p):
        return
    for row in csv.DictReader(open(p, encoding='utf-8')):
        code = SYN.get(row['PARTY_CODE'].strip().upper(), row['PARTY_CODE'].strip())
        NAME2CODE.setdefault(_simp(row['PARTY']), code)
        DISPLAY.setdefault(code, row['PARTY'].strip())


for k, v in MANUAL_NAMES.items():
    NAME2CODE[_simp(k)] = v
load_ls_names()
for k, v in MANUAL_NAMES.items():
    NAME2CODE[_simp(k)] = v
# 'Others' is a bucket of small parties, not CPI(M) (a stray CSV row used to map it there)
for k in ('others', 'oth'):
    NAME2CODE[k] = 'OTH'


def acronym(name):
    words = re.findall(r"[A-Za-z]+", name)
    stop = {'of', 'the', 'and', 'for', 'party'}
    a = ''.join(w[0].upper() for w in words if w.lower() not in stop)
    return a or name[:6].upper()


def norm(raw):
    if raw is None:
        return 'OTH'
    s = str(raw).strip()
    if not s or s.lower() == 'nan':
        return 'OTH'
    # strip trailing bracketed codes like 'Bharatiya Janata Party (BJP)'
    m = re.match(r'^(.*?)\s*\(([A-Z][A-Z0-9()\-]{1,12})\)$', s)
    simp = _simp(s)
    if simp in NAME2CODE:
        return NAME2CODE[simp]
    if m and _simp(m.group(1)) in NAME2CODE:
        return NAME2CODE[_simp(m.group(1))]
    up = s.upper()
    if up in SYN:
        return SYN[up]
    looks_code = (' ' not in s and len(s) <= 14) or (s.isupper() and len(s) <= 14)
    if looks_code:
        return SYN.get(up, up)
    code = acronym(s)
    DISPLAY.setdefault(code, s)
    NAME2CODE[simp] = code
    return code


def color(code):
    if code in COLORS:
        return COLORS[code]
    h = int(hashlib.md5(code.encode()).hexdigest(), 16)
    return PALETTE[h % len(PALETTE)]


def display(code):
    return DISPLAY.get(code, code)

# parties appearing in real constituency results (seat_overrides)
DISPLAY.update({
    'BGPM': 'Bharatiya Gorkha Prajatantrik Morcha', 'GNC': 'Garo National Council', 'GPP': 'Gujarat Parivartan Party',
    'HLP': 'Haryana Lokhit Party', 'IIP': 'Indian Inclusive Party', 'JKAP': 'J&K Apni Party',
    'KHNAM': 'KHNAM', 'KSP': 'Krantikari Shetkari Paksha', 'MCC': 'Marxist Coordination Committee',
    'NJSM': 'Nav Jawan Sangharsh Morcha', 'RD': 'Raijor Dal', 'RPIA': 'Republican Party of India (A)',
    'RSVA': 'Rajarshi Shahu Vikas Aghadi', 'RYSP': 'Rashtriya Yuva Swabhiman Party',
})
for _k, _c in {'BGPM': '#2E7D32', 'GNC': '#8D6E63', 'GPP': '#F4A261', 'HLP': '#9C6644', 'IIP': '#5E60CE',
               'JKAP': '#3A86FF', 'KHNAM': '#6D597A', 'KSP': '#BC4749', 'MCC': '#C1121F', 'NJSM': '#588157',
               'RD': '#D62828', 'RPIA': '#1D3557', 'RSVA': '#E9C46A', 'RYSP': '#7B2CBF'}.items():
    COLORS.setdefault(_k, _c)
