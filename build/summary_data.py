"""Statewide results for assembly elections where seat-level data was not available.
Source: Wikipedia election articles (retrieved Oct 2026), WB 2026 vote shares from India TV / ECI.
Format: (state, year, seats, turnout, [(code, alliance, seats_won, vote_pct), ...], note)
Remaining vote share is assigned to OTH.
"""

S = []

def add(state, year, seats, turnout, rows, note=''):
    S.append(dict(state=state, year=year, seats=seats, turnout=turnout, rows=rows, note=note))

add('Gujarat', 2012, 182, 72.5, [('BJP', 'NDA', 115, 47.86), ('INC', 'UPA', 61, 38.94), ('GPP', '', 2, 3.63),
    ('NCP', '', 2, 0.95), ('JDU', '', 1, 0.67), ('IND', '', 1, 5.82), ('BSP', '', 0, 1.25)])
add('Gujarat', 2017, 182, 69.0, [('BJP', 'NDA', 99, 49.1), ('INC', 'UPA', 77, 41.4), ('IND', '', 3, 4.3),
    ('BTP', 'UPA', 2, 0.7), ('NCP', '', 1, 0.6), ('BSP', '', 0, 0.7), ('NOTA', '', 0, 1.8)])
add('Gujarat', 2022, 182, 64.8, [('BJP', 'NDA', 156, 52.50), ('INC', 'INDIA', 17, 27.28), ('AAP', '', 5, 12.92),
    ('SP', '', 1, 0.3), ('IND', '', 3, 4.2), ('NOTA', '', 0, 1.6)], 'Independent and SP vote shares estimated')
add('Himachal Pradesh', 2017, 68, 75.6, [('BJP', 'NDA', 44, 48.8), ('INC', 'UPA', 21, 41.7), ('IND', '', 2, 6.3),
    ('CPI(M)', '', 1, 1.5), ('BSP', '', 0, 0.5), ('NOTA', '', 0, 0.9)])
add('Himachal Pradesh', 2022, 68, 75.8, [('INC', 'INDIA', 40, 43.90), ('BJP', 'NDA', 25, 43.00), ('AAP', '', 0, 1.10),
    ('CPI(M)', '', 0, 0.66), ('BSP', '', 0, 0.35), ('IND', '', 3, 9.70), ('NOTA', '', 0, 0.59)])
add('Haryana', 2014, 90, 76.5, [('BJP', 'NDA', 47, 33.2), ('INLD', '', 19, 24.1), ('INC', 'UPA', 15, 20.6),
    ('HJC', '', 2, 3.6), ('BSP', '', 1, 4.4), ('SAD', 'NDA', 1, 0.6), ('IND', '', 5, 10.6), ('NOTA', '', 0, 0.4)])
add('Haryana', 2019, 90, 68.2, [('BJP', 'NDA', 40, 36.49), ('INC', 'UPA', 31, 28.08), ('JJP', '', 10, 14.80),
    ('INLD', '', 1, 2.44), ('HLP', '', 1, 0.66), ('BSP', '', 0, 4.21), ('SAD', '', 0, 0.38), ('IND', '', 7, 9.17),
    ('NOTA', '', 0, 0.53)])
add('Haryana', 2024, 90, 68.0, [('BJP', 'NDA', 48, 39.94), ('INC', 'INDIA', 37, 39.09), ('CPI(M)', 'INDIA', 0, 0.25),
    ('INLD', 'INLD+', 2, 4.14), ('BSP', 'INLD+', 0, 1.82), ('JJP', '', 0, 0.90), ('AAP', '', 0, 1.79),
    ('IND', '', 3, 10.47), ('NOTA', '', 0, 0.38)], 'AAP share approximated from "other parties"')
add('Maharashtra', 2014, 288, 63.4, [('BJP', 'NDA', 122, 27.81), ('SHS', '', 63, 19.35), ('INC', 'UPA', 42, 17.95),
    ('NCP', '', 41, 17.24), ('PWPI', '', 3, 1.01), ('BVA', '', 3, 0.62), ('AIMIM', '', 2, 0.93), ('MNS', '', 1, 3.15),
    ('BBM', '', 1, 0.89), ('RSPS', 'NDA', 1, 0.49), ('CPI(M)', '', 1, 0.39), ('SP', '', 1, 0.17), ('IND', '', 7, 4.71),
    ('BSP', '', 0, 2.25)], 'BSP share from memory of ECI report')
add('Maharashtra', 2019, 288, 61.4, [('BJP', 'NDA', 105, 25.75), ('SHS', 'NDA', 56, 16.41), ('NCP', 'UPA', 54, 16.71),
    ('INC', 'UPA', 44, 15.87), ('BVA', '', 3, 0.67), ('AIMIM', '', 2, 1.34), ('SP', '', 2, 0.22), ('PJP', '', 2, 0.48),
    ('CPI(M)', '', 1, 0.37), ('MNS', '', 1, 2.25), ('PWPI', '', 1, 0.97), ('SWP', '', 1, 0.40), ('JSS', 'NDA', 1, 0.36),
    ('KSP', '', 1, 0.21), ('RSPS', 'NDA', 1, 0.15), ('VBA', '', 0, 4.58), ('IND', '', 13, 9.93), ('NOTA', '', 0, 1.35)])
add('Maharashtra', 2024, 288, 66.1, [('BJP', 'Mahayuti', 132, 26.77), ('SHS_SHINDE', 'Mahayuti', 57, 12.38),
    ('NCP', 'Mahayuti', 41, 9.01), ('JSS', 'Mahayuti', 2, 0.41), ('RSPS', 'Mahayuti', 1, 0.22), ('RYSP', 'Mahayuti', 1, 0.30),
    ('RSVA', 'Mahayuti', 1, 0.21), ('INC', 'MVA', 16, 12.42), ('SSUBT', 'MVA', 20, 9.96), ('NCPSP', 'MVA', 10, 11.28),
    ('SP', 'MVA', 2, 0.38), ('PWPI', 'MVA', 1, 0.76), ('CPI(M)', 'MVA', 1, 0.34), ('AIMIM', '', 1, 0.85),
    ('IND', '', 2, 6.0), ('NOTA', '', 0, 0.72)], 'AIMIM and Independent shares estimated')
add('Jharkhand', 2014, 81, 66.5, [('BJP', 'NDA', 37, 31.26), ('JMM', '', 19, 20.43), ('JVM', '', 8, 9.99),
    ('INC', 'UPA', 6, 10.46), ('AJSU', 'NDA', 5, 3.68), ('BSP', '', 1, 1.82), ('CPIML', '', 1, 1.52), ('JKP', '', 1, 1.11),
    ('MCC', '', 1, 1.02), ('JBSP', '', 1, 0.79), ('NJSM', '', 1, 0.49), ('LJP', 'NDA', 0, 0.3), ('RJD', 'UPA', 0, 3.13),
    ('JDU', '', 0, 0.96), ('IND', '', 0, 6.69), ('NOTA', '', 0, 1.69)], 'LJP won 0 seats here; seat total 81 balanced')
add('Jharkhand', 2019, 81, 65.4, [('JMM', 'UPA', 30, 18.72), ('INC', 'UPA', 16, 13.88), ('RJD', 'UPA', 1, 2.75),
    ('BJP', 'NDA', 25, 33.37), ('JVM', '', 3, 5.45), ('AJSU', '', 2, 8.10), ('CPIML', '', 1, 1.15), ('NCP', '', 1, 0.42),
    ('AIMIM', '', 0, 1.16), ('IND', '', 2, 6.55), ('NOTA', '', 0, 1.36)])
add('Jharkhand', 2024, 81, 68.3, [('JMM', 'INDIA', 34, 23.44), ('INC', 'INDIA', 16, 15.56), ('RJD', 'INDIA', 4, 3.44),
    ('CPIML', 'INDIA', 2, 1.89), ('BJP', 'NDA', 21, 33.18), ('AJSU', 'NDA', 1, 3.54), ('JDU', 'NDA', 1, 0.81),
    ('LJPRV', 'NDA', 1, 0.61), ('JLKM', '', 1, 6.20), ('IND', '', 0, 6.39), ('NOTA', '', 0, 1.27)])
add('Jammu & Kashmir', 2014, 87, 65.9, [('JKPDP', '', 28, 22.67), ('BJP', 'NDA', 25, 22.98), ('JKNC', '', 15, 20.77),
    ('INC', '', 12, 18.01), ('JKPC', '', 2, 1.93), ('CPI(M)', '', 1, 0.50), ('JKNPP', '', 0, 1.99), ('IND', '', 3, 6.85),
    ('OTH', '', 1, 3.28), ('NOTA', '', 0, 1.02)])
add('Jammu & Kashmir', 2024, 90, 64.3, [('JKNC', 'INDIA', 42, 23.43), ('BJP', 'NDA', 29, 25.64), ('INC', 'INDIA', 6, 11.97),
    ('JKPDP', '', 3, 8.87), ('JKPC', '', 1, 2.5), ('CPI(M)', 'INDIA', 1, 0.59), ('AAP', '', 1, 0.52),
    ('JKNPP', 'INDIA', 0, 1.16), ('IND', '', 7, 20.0), ('NOTA', '', 0, 1.48)],
    'New 90-seat delimitation; seat names are placeholders. Independent share trimmed to leave room for small parties')
add('Arunachal Pradesh', 2014, 60, 80.8, [('INC', 'UPA', 42, 49.50), ('BJP', 'NDA', 11, 30.97), ('PPA', 'NDA', 5, 8.96),
    ('NCP', '', 0, 3.84), ('NPF', '', 0, 0.75), ('IND', '', 2, 4.92), ('NOTA', '', 0, 1.05)])
add('Arunachal Pradesh', 2019, 60, 82.2, [('BJP', 'NDA', 41, 50.86), ('JDU', '', 7, 9.88), ('NPP', '', 5, 14.56),
    ('INC', 'UPA', 4, 16.85), ('PPA', '', 1, 1.73), ('JDS', '', 0, 2.16), ('IND', '', 2, 2.99), ('NOTA', '', 0, 0.94)])
add('Arunachal Pradesh', 2024, 60, 83.0, [('BJP', 'NDA', 46, 54.57), ('NPP', '', 5, 16.11), ('NCP', '', 3, 10.43),
    ('PPA', '', 2, 7.24), ('INC', 'INDIA', 1, 5.56), ('IND', '', 3, 4.66), ('NOTA', '', 0, 0.66)],
    'Includes 10 BJP seats won unopposed')
add('Sikkim', 2014, 32, 81.0, [('SDF', '', 22, 55.03), ('SKM', '', 10, 40.80), ('INC', '', 0, 1.42), ('BJP', '', 0, 0.71),
    ('IND', '', 0, 0.40), ('NOTA', '', 0, 1.44)])
add('Sikkim', 2019, 32, 81.4, [('SKM', '', 17, 47.03), ('SDF', '', 15, 47.63), ('BJP', '', 0, 1.62), ('INC', '', 0, 0.77),
    ('HSP', '', 0, 0.60), ('IND', '', 0, 0.93), ('NOTA', '', 0, 0.86)])
add('Sikkim', 2024, 32, 79.9, [('SKM', 'NDA', 31, 58.38), ('SDF', '', 1, 27.37), ('CAPS', '', 0, 6.03), ('BJP', '', 0, 5.18),
    ('INC', '', 0, 0.32), ('IND', '', 0, 1.73), ('NOTA', '', 0, 0.99)])
add('Telangana', 2014, 119, 69.0, [('BRS', '', 63, 34.30), ('INC', 'UPA', 21, 25.20), ('TDP', 'NDA', 15, 14.70),
    ('BJP', 'NDA', 5, 7.10), ('YSRCP', '', 3, 3.40), ('AIMIM', '', 7, 3.80), ('BSP', '', 2, 1.40), ('CPI(M)', '', 1, 1.60),
    ('CPI', '', 1, 0.90), ('IND', '', 1, 5.00)])
add('Andhra Pradesh', 2014, 175, 78.0, [('TDP', 'NDA', 102, 44.90), ('YSRCP', '', 67, 44.60), ('BJP', 'NDA', 4, 2.20),
    ('INC', 'UPA', 0, 2.80), ('BSP', '', 0, 0.70), ('CPI(M)', '', 0, 0.50), ('OTH', '', 1, 1.70), ('IND', '', 1, 1.80)],
    'Residual Andhra Pradesh seats of the undivided 2014 election')
add('Odisha', 2014, 147, 73.8, [('BJD', '', 117, 43.35), ('INC', 'UPA', 16, 25.71), ('BJP', 'NDA', 10, 17.99),
    ('CPI(M)', '', 1, 0.37), ('SKD', '', 1, 0.40), ('IND', '', 2, 5.04), ('NOTA', '', 0, 1.26)])
add('Delhi', 2015, 70, 67.5, [('AAP', '', 67, 54.3), ('BJP', 'NDA', 3, 32.2), ('INC', '', 0, 9.7), ('BSP', '', 0, 1.3),
    ('INLD', '', 0, 0.6), ('SAD', 'NDA', 0, 0.5), ('IND', '', 0, 0.5), ('NOTA', '', 0, 0.4)])
add('Delhi', 2020, 70, 62.8, [('AAP', '', 62, 53.57), ('BJP', 'NDA', 8, 38.51), ('INC', 'UPA', 0, 4.26), ('BSP', '', 0, 0.71),
    ('JDU', 'NDA', 0, 0.91), ('LJP', 'NDA', 0, 0.35), ('NOTA', '', 0, 0.46)])
add('Delhi', 2025, 70, 60.5, [('BJP', 'NDA', 48, 45.56), ('JDU', 'NDA', 0, 1.06), ('LJPRV', 'NDA', 0, 0.53),
    ('AAP', '', 22, 43.57), ('INC', '', 0, 6.34), ('NOTA', '', 0, 0.57)])
add('Bihar', 2015, 243, 56.9, [('RJD', 'MGB', 80, 18.4), ('JDU', 'MGB', 71, 16.8), ('INC', 'MGB', 27, 6.7),
    ('BJP', 'NDA', 53, 24.4), ('LJP', 'NDA', 2, 4.8), ('RLM', 'NDA', 2, 2.6), ('HAMS', 'NDA', 1, 2.3),
    ('CPI', 'Left', 0, 1.36), ('CPIML', 'Left', 3, 1.54), ('CPI(M)', 'Left', 0, 0.61), ('SP', '', 0, 1.0),
    ('BSP', '', 0, 2.1), ('NCP', '', 0, 0.5), ('IND', '', 4, 9.4), ('NOTA', '', 0, 2.5)])
add('Bihar', 2020, 243, 57.3, [('BJP', 'NDA', 74, 19.46), ('JDU', 'NDA', 43, 15.39), ('VIP', 'NDA', 4, 1.52),
    ('HAMS', 'NDA', 4, 0.89), ('RJD', 'MGB', 75, 23.11), ('INC', 'MGB', 19, 9.48), ('CPIML', 'MGB', 12, 3.16),
    ('CPI', 'MGB', 2, 0.83), ('CPI(M)', 'MGB', 2, 0.65), ('AIMIM', 'GDSF', 5, 1.24), ('BSP', 'GDSF', 1, 1.49),
    ('RLM', 'GDSF', 0, 1.77), ('LJP', '', 1, 5.66), ('IND', '', 1, 8.64), ('NOTA', '', 0, 1.68)])
add('Bihar', 2025, 243, 67.3, [('BJP', 'NDA', 89, 20.08), ('JDU', 'NDA', 85, 19.25), ('LJPRV', 'NDA', 19, 4.97),
    ('HAMS', 'NDA', 5, 1.17), ('RLM', 'NDA', 4, 1.06), ('RJD', 'MGB', 25, 23.00), ('INC', 'MGB', 6, 8.71),
    ('CPIML', 'MGB', 2, 2.84), ('VIP', 'MGB', 0, 1.37), ('CPI', 'MGB', 0, 0.74), ('CPI(M)', 'MGB', 1, 0.61),
    ('IIP', 'MGB', 1, 0.37), ('AIMIM', '', 5, 1.85), ('JSURAJ', '', 0, 3.34), ('BSP', '', 1, 1.62), ('IND', '', 0, 4.5),
    ('NOTA', '', 0, 1.81)], 'Independent share estimated')
add('Tripura', 2018, 60, 91.4, [('BJP', 'NDA', 36, 43.59), ('IPFT', 'NDA', 8, 7.38), ('CPI(M)', 'Left', 16, 42.22),
    ('CPI', 'Left', 0, 0.82), ('RSP', 'Left', 0, 0.75), ('AIFB', 'Left', 0, 0.56), ('INC', '', 0, 1.79),
    ('AITC', '', 0, 0.30), ('NOTA', '', 0, 1.03)])
add('Tripura', 2023, 60, 89.8, [('BJP', 'NDA', 32, 38.97), ('IPFT', 'NDA', 1, 1.26), ('CPI(M)', 'Left+INC', 11, 24.62),
    ('INC', 'Left+INC', 3, 8.56), ('AIFB', 'Left+INC', 0, 1.03), ('RSP', 'Left+INC', 0, 0.67), ('CPI', 'Left+INC', 0, 0.48),
    ('TIPRA', '', 13, 19.69), ('AITC', '', 0, 0.88), ('IND', '', 0, 1.6), ('NOTA', '', 0, 1.36)])
add('Meghalaya', 2018, 60, 86.7, [('INC', '', 21, 28.5), ('NPP', '', 20, 20.6), ('UDP', '', 6, 11.6), ('IND', '', 3, 10.8),
    ('BJP', '', 2, 9.6), ('PDF', '', 4, 8.2), ('HSPDP', '', 2, 5.3), ('NCP', '', 1, 1.6), ('GNC', '', 0, 1.4),
    ('KHNAM', '', 1, 0.9), ('AITC', '', 0, 0.4), ('NOTA', '', 0, 0.9)])
add('Meghalaya', 2023, 60, 86.8, [('NPP', 'MDA', 26, 31.49), ('UDP', 'MDA', 12, 16.21), ('AITC', '', 5, 13.78),
    ('INC', '', 5, 13.14), ('VPP', '', 4, 5.46), ('BJP', 'MDA', 2, 9.33), ('HSPDP', 'MDA', 2, 3.56), ('PDF', 'MDA', 2, 1.88),
    ('GNC', '', 0, 0.53), ('IND', '', 2, 3.6), ('NOTA', '', 0, 0.79)])
add('Nagaland', 2018, 60, 85.6, [('NPF', '', 26, 38.8), ('NDPP', 'NDA', 18, 25.2), ('BJP', 'NDA', 12, 15.3),
    ('NPP', '', 2, 6.9), ('JDU', '', 1, 4.5), ('IND', '', 1, 4.3), ('INC', '', 0, 2.1), ('NCP', '', 0, 1.1)])
add('Nagaland', 2023, 60, 86.7, [('NDPP', 'NDA', 25, 32.24), ('BJP', 'NDA', 12, 18.80), ('NCP', '', 7, 9.56),
    ('NPP', '', 5, 5.76), ('LJPRV', '', 2, 8.64), ('NPF', '', 2, 7.09), ('RPIA', '', 2, 3.69), ('JDU', '', 1, 3.25),
    ('INC', '', 0, 3.56), ('IND', '', 4, 6.27), ('NOTA', '', 0, 0.31)])
add('Assam', 2026, 126, 85.4, [('BJP', 'NDA', 82, 37.81), ('AGP', 'NDA', 10, 6.48), ('BPF', 'NDA', 10, 3.73),
    ('INC', 'Opposition', 19, 29.84), ('RD', 'Opposition', 2, 2.68), ('AJP', 'Opposition', 0, 2.52),
    ('CPI(M)', 'Opposition', 0, 0.47), ('AIUDF', '', 2, 5.46), ('AITC', '', 1, 0.89), ('UPPL', '', 0, 2.29),
    ('JMM', '', 0, 1.16), ('IND', '', 0, 4.37), ('NOTA', '', 0, 1.23)],
    'Held on the 2023 delimitation; seat names/boundaries shown are from the earlier map')
add('West Bengal', 2026, 294, 93.7, [('BJP', 'NDA', 208, 45.9), ('AITC', '', 80, 40.7), ('CPI(M)', 'Left', 1, 4.45),
    ('INC', '', 2, 2.97), ('AISF', 'Left', 1, 0.8), ('AJUP', '', 2, 0.9), ('AIFB', 'Left', 0, 0.28), ('CPI', 'Left', 0, 0.16),
    ('RSP', 'Left', 0, 0.10), ('BSP', '', 0, 0.18), ('NOTA', '', 0, 0.78)],
    'AISF and AJUP vote shares estimated; seat counts per Wikipedia')
