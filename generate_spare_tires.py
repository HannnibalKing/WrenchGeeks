import json

platforms = {
    "4x100_BMW": ["BMW_E30", "BMW_3_SERIES__E21___1ST_GEN_"],
    "5x120_BMW_STD": ["BMW_E36", "BMW_E46", "BMW_E90_E92", "BMW_M50_M52", "BMW_N54_N55", "BMW_5_SERIES__E12___1ST_GEN_", "BMW_5_SERIES__E28___2ND_GEN_", "BMW_5_SERIES__E34___3RD_GEN_"],
    "5x120_BMW_E39": ["BMW_E39"],
    "4x100_VW": ["VOLKSWAGEN_GOLF__A1___MK1_", "VOLKSWAGEN_GOLF__A2___MK2_", "VOLKSWAGEN_GOLF__A3___MK3_", "VOLKSWAGEN_JETTA__A1___MK1_", "VOLKSWAGEN_JETTA__A2___MK2_", "VOLKSWAGEN_JETTA__A3___MK3_", "VOLKSWAGEN_PASSAT__B1___MK1_", "VOLKSWAGEN_PASSAT__B2___MK2_", "VOLKSWAGEN_PASSAT__B3___MK3_", "VOLKSWAGEN_PASSAT__B4___MK4_", "GEO_METRO", "GEO_PRIZM", "SATURN_S_SERIES", "SATURN_ION"],
    "5x100_VW_SUBARU": ["VW_MK4", "VOLKSWAGEN_GOLF__A4___MK4_", "VOLKSWAGEN_JETTA__A4___MK4_", "SUBARU_IMPREZA_WRX", "SUBARU_LEGACY__BC_BF_BJ___GEN_1_", "SUBARU_LEGACY__BD_BG_BK___GEN_2_", "SUBARU_LEGACY__BE_BH___GEN_3_", "SUBARU_LEGACY__BL_BP___GEN_4_", "SUBARU_LEGACY__BM_BR___GEN_5_", "SUBARU_FORESTER__SF___GEN_1_", "SUBARU_FORESTER__SG___GEN_2_", "SUBARU_FORESTER__SH___GEN_3_", "SUBARU_FORESTER__SJ___GEN_4_", "SUBARU_BRZ_86", "SUBARU_TOYOTA_TWINS", "GM_J_BODY", "PONTIAC_VIBE", "PONTIAC_FIERO", "CHRYSLER_PROWLER", "CHRYSLER_K_DERIVATIVES", "CHRYSLER_MINIVANS", "DODGE_PL", "SAAB_SUBARU_GG", "RALLY_HOMOLOGATION_JAPAN"],
    "5x112_VAG_MERC": ["VOLKSWAGEN_GOLF__A5___MK5_", "VOLKSWAGEN_GOLF__A6___MK6_", "VOLKSWAGEN_GOLF__A7___MK7_", "VOLKSWAGEN_GOLF__A8___MK8_", "VOLKSWAGEN_JETTA__A5___MK5_", "VOLKSWAGEN_JETTA__A6___MK6_", "VOLKSWAGEN_JETTA__A7___MK7_", "VOLKSWAGEN_PASSAT__B5___MK5_", "VOLKSWAGEN_PASSAT__B6___MK6_", "VOLKSWAGEN_PASSAT__B7___MK7_", "VOLKSWAGEN_PASSAT__B8___MK8_", "VAG_PL71", "VAG_MLB_GEN1", "VAG_PL45", "MERCEDES_W123_W124", "MERCEDES_C_CLASS", "MERCEDES_E_CLASS", "CHRYSLER_CROSSFIRE", "SUPRA_MK5", "LAMBORGHINI_V10"],
    "5x130_PORSCHE": ["PORSCHE_986_996", "PORSCHE_AIRCOOLED_911", "PORSCHE_987_997", "PORSCHE_981_991", "PORSCHE_718_992", "PORSCHE_OTHER", "PORSCHE_TRANSAXLE", "PORSCHE_924_944"],
    "5x108_VOLVO_FORD": ["VOLVO_REDBLOCK", "VOLVO_P80_PLATFORM", "VOLVO_RWD_BRICKS", "VOLVO_P80", "VOLVO_P2", "VOLVO_P2_PLATFORM", "VOLVO_RWD_TURBO", "FORD_CT120_ESCORT", "JAGUAR_X_TYPE", "FERRARI_V8_MID", "FORD_C1_PLATFORM", "LOTUS_ESPRIT", "POLESTAR_CMA"],
    "4x108_FORD_PSA": ["FORD_FOX", "FORD_COMPACT_PERFORMANCE", "SAAB_LEGENDS", "FRENCH_HOT_HATCH_PEUGEOT", "FRENCH_HOT_HATCH_CITROEN", "KIT_CATERHAM_7", "PSA_PF1", "PSA_PF2", "RALLY_HOMOLOGATION_FORD"],
    "4x100_HONDA_MAZDA": ["HONDA_CIVIC_GOLDEN", "HONDA_CIVIC_LEGENDS", "HONDA_CIVIC__SB_SG___1ST_GEN_", "HONDA_CIVIC__SL_SS___2ND_GEN_", "HONDA_CIVIC__AG_AH_AT___3RD_GEN_", "MAZDA_MIATA", "TOYOTA_COROLLA__E80___5TH_GEN_", "TOYOTA_COROLLA__E90___6TH_GEN_", "TOYOTA_COROLLA__E100___7TH_GEN_", "TOYOTA_MR2", "ABC_KEI_SPORTS", "SUZUKI_SWIFT_CULTUS", "KIT_EXOMOTIVE_EXOCET", "EXO_ARIEL_ATOM", "LOTUS_ELISE_S2", "FRENCH_HOT_HATCH_RENAULT"],
    "5x114_JDM_FORD": ["HONDA_ACCORD_CLASSIC", "HONDA_CRV_RD", "HONDA_CRV_MODERN", "HONDA_S2000", "HONDA_INTEGRA_RSX", "HONDA_DC5_EP3", "HONDA_CIVIC_MODERN", "HONDA_RWD_MID", "HONDA_ACCORD__SJ_SM___1ST_GEN_", "HONDA_ACCORD__SY_AC_AD___2ND_GEN_", "HONDA_ACCORD__CA___3RD_GEN_", "HONDA_ACCORD__CB___4TH_GEN_", "HONDA_ACCORD__CD_CE___5TH_GEN_", "HONDA_ACCORD__CG_CF___6TH_GEN_", "HONDA_ACCORD__CM_CL___7TH_GEN_", "HONDA_ACCORD__CP_CS___8TH_GEN_", "HONDA_ACCORD__CR___9TH_GEN_", "HONDA_ACCORD__CV___10TH_GEN_", "TOYOTA_RAV4_GENERATIONS", "TOYOTA_CAMRY_CLASSIC", "TOYOTA_CAMRY_MODERN", "TOYOTA_SUPRA_LEGACY", "TOYOTA_GR_MODERN", "TOYOTA_CAMRY__V10___1ST_GEN_", "TOYOTA_CAMRY__V20___2ND_GEN_", "TOYOTA_CAMRY__XV10___3RD_GEN_", "TOYOTA_CAMRY__XV20___4TH_GEN_", "TOYOTA_CAMRY__XV30___5TH_GEN_", "TOYOTA_CAMRY__XV40___6TH_GEN_", "TOYOTA_CAMRY__XV50___7TH_GEN_", "TOYOTA_CAMRY__XV70___8TH_GEN_", "TOYOTA_COROLLA__E110___8TH_GEN_", "TOYOTA_COROLLA__E120_E130___9TH_GEN_", "TOYOTA_COROLLA__E140_E150___10TH_GEN_", "TOYOTA_COROLLA__E160_E170___11TH_GEN_", "TOYOTA_COROLLA__E210___12TH_GEN_", "TOYOTA_2JZ_GE", "TOYOTA_UZ_FE", "NISSAN_S_CHASSIS", "NISSAN_Z_CAR", "NISSAN_SKYLINE_GTR", "NISSAN_SKYLINE_GT_R", "NISSAN_Z_LEGACY", "NISSAN_FM_PLATFORM", "NISSAN_ALTIMA__U13___GEN_1_", "NISSAN_ALTIMA__L30___GEN_2_", "NISSAN_ALTIMA__L31___GEN_3_", "NISSAN_ALTIMA__L32___GEN_4_", "NISSAN_ALTIMA__L33___GEN_5_", "NISSAN_ALTIMA__L34___GEN_6_", "NISSAN_MAXIMA__J30___GEN_3_", "NISSAN_MAXIMA__A32___GEN_4_", "NISSAN_MAXIMA__A33___GEN_5_", "NISSAN_MAXIMA__A34___GEN_6_", "MAZDA_RX7", "MAZDA_ROTARY", "MITSUBISHI_EVO", "MITSUBISHI_DSM", "MITSUBISHI_3000GT", "MITSUBISHI_GALANT_LEGNUM", "SUBARU_WRX_STI", "SUBARU_LEGACY__BN_BS___GEN_6_", "SUBARU_LEGACY__BW_BT___GEN_7_", "SUBARU_FORESTER__SK___GEN_5_", "HYUNDAI_GENESIS_COUPE", "HYUNDAI_KIA_E_GMP", "HYUNDAI_KIA_N3", "HYUNDAI_KIA_J_PLATFORM", "HYUNDAI_KIA_RWD_SPORT", "FORD_MUSTANG_GENERATIONS", "FORD_SN95_NEWEDGE", "FORD_S197", "FORD_S550", "FORD_RANGER_MAZDA_B", "FORD_RANGER", "FORD_PANTHER", "FORD_FALCON_CLASSIC", "FORD_FALCON_EA_AU", "FORD_FALCON_BA_FG", "JEEP_CHEROKEE_XJ", "JEEP_WRANGLER_TJ", "JEEP_AMC_40", "JEEP_XJ", "KIT_FACTORY_FIVE_MK4", "ASTON_MARTIN_VH", "FORD_RANGER_RBV", "HONDA_K_SERIES_PLATFORM", "JEEP_CHEROKEE", "LEXUS_LS_UCF", "MASERATI_M145", "MOPAR_CLASSIC_B_BODY", "MOPAR_CLASSIC_E_BODY", "TESLA_MODEL_3_Y", "FACEL_VEGA_V8", "BRICKLIN_SV1"],
    "6x139_TRUCK": ["GM_TRUCK_GENERATIONS", "GM_TRUCK_CLASSIC", "GM_TRUCK_MODERN", "TOYOTA_LAND_CRUISER", "TOYOTA_4RUNNER_N180", "MITSUBISHI_PAJERO_MONTERO", "NISSAN_TITAN", "FORD_RANGER__PRE_1983_", "TOYOTA_TRUCK_FRAME"],
    "5x120_GM_HOLDEN": ["CHEVY_MODERN_FAMILY", "CHEVY_MALIBU_GENERATIONS", "GM_EPSILON_2", "CHEVY_CAMARO", "PONTIAC_G8", "PONTIAC_GTO", "HOLDEN_COMMODORE_CLASSIC", "HOLDEN_COMMODORE_VN_VS", "HOLDEN_COMMODORE_VT_VZ", "HOLDEN_COMMODORE_VE_VF", "CADILLAC_CATERA", "SAAB_GM2900", "TESLA_MODEL_S_X", "LUCID_AIR"],
    "5x120_65_GM_RWD": ["CHEVY_CORVETTE", "GM_S10_SONOMA", "GM_G_BODY_RWD", "GM_MUSCLE_CLASSIC", "PONTIAC_FIREBIRD", "GM_S10_2ND_GEN", "ISO_GRIFO_SERIES"],
    "5x115_GM_MOPAR": ["GM_W_BODY_GEN2", "GM_W_BODY_GEN3", "GM_H_BODY", "PONTIAC_GRAND_PRIX", "DAIMLER_CHRYSLER_LX", "CHRYSLER_LH_PLATFORM"],
    "5x110_GM": ["GM_EPSILON_1", "PONTIAC_SOLSTICE", "SATURN_L_SERIES", "SATURN_VUE", "KIT_DF_GOBLIN", "FCA_CUSW", "FCA_SMALL_WIDE"],
    "5x127_JEEP_GM": ["JEEP_WRANGLER_JK", "JEEP_WRANGLER", "GM_GMT360"],
    "5x139_RAM_FORD": ["DODGE_RAM_GENERATIONS", "RAM_DS_DT", "FORD_F_SERIES_CLASSIC", "FORD_BRONCO", "FORD_F_150__GEN_1___F_SERIES_", "FORD_F_150__GEN_2___F_SERIES_", "FORD_F_150__GEN_3___F_SERIES_", "FORD_F_150__GEN_4___F_SERIES_", "FORD_F_150__GEN_5___F_SERIES_", "FORD_F_150__GEN_6___F_SERIES_", "FORD_F_150__GEN_7___F_SERIES_", "FORD_F_150__GEN_8___F_SERIES_", "FORD_F_150__GEN_9___F_SERIES_", "SUZUKI_OFFROAD", "GEO_TRACKER", "FORD_FLATHEAD_ERA", "RIVIAN_R1"],
    "6x135_FORD": ["FORD_F_SERIES_MODERN", "FORD_F_150__GEN_11___F_SERIES_", "FORD_F_150__GEN_12___F_SERIES_", "FORD_F_150__GEN_13___F_SERIES_", "FORD_F_150__GEN_14___F_SERIES_"],
    "5x135_FORD": ["FORD_F_150__GEN_10___F_SERIES_"],
    "8x170_FORD": ["FORD_SUPER_DUTY_GENERATIONS"],
    "4x130_VW_AIR": ["VW_AIRCOOLED_LEGENDS", "KIT_MEYERS_MANX"],
    "4x98_FIAT": ["FIAT_500_ABARTH", "ALFA_ROMEO_MODERN", "TYPE_FOUR_PLATFORM", "RALLY_HOMOLOGATION_LANCIA"],
    "4x114_NISSAN_OLD": ["NISSAN_ALTIMA__U13___GEN_1_", "SUZUKI_KEI_CLASSIC", "GEO_STORM"],
    "6x114_VIPER": ["DODGE_VIPER"],
    "5x165_LANDROVER": ["LAND_ROVER_CLASSIC"],
    "5x120_LANDROVER": ["LAND_ROVER_L322"],
    "4x101_MINI": ["MINI_COOPER_MODERN", "BRITISH_ROADSTER_AUSTIN"],
    "4x114_BRITISH": ["BRITISH_ROADSTER_MG", "BRITISH_ROADSTER_TRIUMPH"],
    "CENTERLOCK": ["PREWAR_EURO_RACING", "EXO_KTM_XBOW", "MCLAREN_F1"],
    "VARIES": ["PREWAR_LUXURY", "NICHE_BUILD_BATTLEWAGON", "KIT_FACTORY_FIVE_818", "FORD_MODEL_T_A", "LAMBORGHINI_V12"]
}

details = {
    "4x100_BMW": {"bolt_pattern": "4x100", "hub_bore": "57.1mm", "advice": "Classic BMW 4-lug. Shares specs with VW 4-lug."},
    "5x120_BMW_STD": {"bolt_pattern": "5x120", "hub_bore": "72.56mm", "advice": "The standard BMW fitment. Fits almost all 5-lug BMWs except E39."},
    "5x120_BMW_E39": {"bolt_pattern": "5x120", "hub_bore": "74.1mm", "advice": "Unique hub bore. Requires hub rings to fit other BMW wheels, or boring out other wheels to fit E39."},
    "4x100_VW": {"bolt_pattern": "4x100", "hub_bore": "57.1mm", "advice": "Ubiquitous 4-lug pattern. Fits VW, Audi, older BMW, Honda (with rings), Miata (with rings)."},
    "5x100_VW_SUBARU": {"bolt_pattern": "5x100", "hub_bore": "57.1mm (VW) / 56.1mm (Subaru)", "advice": "Common on Mk4 VW and most Subarus. Subaru wheels fit VW with 1mm hub ring. VW wheels need boring for Subaru (rare)."},
    "5x112_VAG_MERC": {"bolt_pattern": "5x112", "hub_bore": "57.1mm (Older VAG) / 66.6mm (Merc/Newer Audi)", "advice": "Mercedes wheels fit VW/Audi with hub rings. VW/Audi wheels need boring to fit Mercedes."},
    "5x130_PORSCHE": {"bolt_pattern": "5x130", "hub_bore": "71.6mm", "advice": "Exclusive to Porsche (and Q7/Touareg). High offset usually required."},
    "5x108_VOLVO_FORD": {"bolt_pattern": "5x108", "hub_bore": "65.1mm (Volvo) / 63.4mm (Ford)", "advice": "Volvo wheels fit Ford Focus/Fusion with rings. Ford wheels need boring for Volvo."},
    "4x108_FORD_PSA": {"bolt_pattern": "4x108", "hub_bore": "63.4mm (Ford) / 65.1mm (PSA)", "advice": "Ford Fox body and Peugeot/Citroen share the pattern but offsets are wildly different."},
    "4x100_HONDA_MAZDA": {"bolt_pattern": "4x100", "hub_bore": "56.1mm (Honda) / 54.1mm (Mazda/Toyota)", "advice": "Honda wheels fit Mazda/Toyota with rings. Mazda/Toyota wheels need boring for Honda."},
    "5x114_JDM_FORD": {"bolt_pattern": "5x114.3 (5x4.5)", "hub_bore": "Varies (60.1 - 70.5mm)", "advice": "The most common 5-lug pattern. Ford/Mopar/Nissan/Toyota/Honda. Check hub bore! Ford/Mopar (70.5mm) wheels fit everything else with rings."},
    "6x139_TRUCK": {"bolt_pattern": "6x139.7 (6x5.5)", "hub_bore": "78.1mm (GM) / 106mm (Toyota)", "advice": "Toyota wheels fit GM with rings. GM wheels DO NOT fit Toyota (hub too small)."},
    "5x120_GM_HOLDEN": {"bolt_pattern": "5x120", "hub_bore": "66.9mm (Camaro/VE) / 69.6mm (Older Holden)", "advice": "Metric 5x120. NOT the same as 5x120.65 (4.75). Do not mix."},
    "5x120_65_GM_RWD": {"bolt_pattern": "5x120.65 (5x4.75)", "hub_bore": "70.3mm", "advice": "Classic Chevy pattern. S10, Corvette, Camaro (Pre-2010)."},
    "5x115_GM_MOPAR": {"bolt_pattern": "5x115", "hub_bore": "70.3mm (GM) / 71.5mm (Mopar)", "advice": "FWD GM and modern Dodge Charger/Challenger. Very close to 5x114.3 but NOT interchangeable safely."},
    "5x110_GM": {"bolt_pattern": "5x110", "hub_bore": "65.1mm", "advice": "Oddball pattern shared by GM (Malibu/Cobalt/Saab) and modern Jeep/Fiat (Cherokee KL/Renegade)."},
    "5x127_JEEP_GM": {"bolt_pattern": "5x127 (5x5)", "hub_bore": "71.5mm (Jeep) / 78.1mm (GM)", "advice": "Jeep JK/JL and GM 1500 trucks (Pre-99) / SUVs."},
    "5x139_RAM_FORD": {"bolt_pattern": "5x139.7 (5x5.5)", "hub_bore": "77.8mm (Dodge) / 87mm (Ford)", "advice": "Classic Ford truck and modern Ram 1500. Ford hub is huge."},
    "6x135_FORD": {"bolt_pattern": "6x135", "hub_bore": "87mm", "advice": "Ford F-150 2004-Present. Unique to Ford."},
    "5x135_FORD": {"bolt_pattern": "5x135", "hub_bore": "87mm", "advice": "Ford F-150 1997-2003. One generation only."},
    "8x170_FORD": {"bolt_pattern": "8x170", "hub_bore": "124.9mm", "advice": "Ford Super Duty 1999+. Does not fit older 8x6.5 trucks."},
    "4x130_VW_AIR": {"bolt_pattern": "4x130", "hub_bore": "78.6mm", "advice": "Classic VW Beetle (Late)."},
    "4x98_FIAT": {"bolt_pattern": "4x98", "hub_bore": "58.1mm", "advice": "Fiat/Alfa/Lancia. Can use 4x100 with wobble bolts (sketchy)."},
    "4x114_NISSAN_OLD": {"bolt_pattern": "4x114.3", "hub_bore": "66.1mm", "advice": "Older Nissan/Datsun 4-lug."},
    "6x114_VIPER": {"bolt_pattern": "6x114.3", "hub_bore": "71.5mm", "advice": "Dodge Viper and Dakota/Durango. Weird size."},
    "5x165_LANDROVER": {"bolt_pattern": "5x165.1", "hub_bore": "114mm", "advice": "Classic Land Rover Defender/Discovery 1."},
    "5x120_LANDROVER": {"bolt_pattern": "5x120", "hub_bore": "72.56mm", "advice": "Range Rover L322 (BMW Era) uses BMW wheels."},
    "4x101_MINI": {"bolt_pattern": "4x101.6 (4x4)", "hub_bore": "59.1mm", "advice": "Classic Mini and Austin. Tiny wheels."},
    "4x114_BRITISH": {"bolt_pattern": "4x114.3", "hub_bore": "Varies", "advice": "MGB, Triumph TR6."},
    "CENTERLOCK": {"bolt_pattern": "Center Lock", "hub_bore": "N/A", "advice": "Racing wheels. Single nut."},
    "VARIES": {"bolt_pattern": "Varies", "hub_bore": "Varies", "advice": "Check specific model."}
}

output = []
for pid, p_list in platforms.items():
    entry = details.get(pid, {})
    entry["id"] = pid
    entry["vehicles"] = []
    for platform_id in p_list:
        # We don't have the make/model names here easily without loading relationships.json
        # But the frontend script uses the platform ID to match?
        # Wait, script.v9.js uses "make" and "model" matching against the "vehicles" array in spare_tires.json
        # It does NOT use platform ID directly for spare tires.
        # It finds the spare tire group by matching the vehicle name.
        # So I need to populate "vehicles" with {make, model} objects.
        entry["vehicles"].append({"platform_id": platform_id}) 

# To do this correctly, I need to load relationships.json and resolve the platform IDs to Make/Model names.
with open('docs/data/relationships.json', 'r', encoding='utf-8') as f:
    rel_data = json.load(f)

final_output = []

for pid, p_list in platforms.items():
    entry = details.get(pid, {}).copy()
    entry["id"] = pid
    entry["vehicles"] = []
    
    for platform_id in p_list:
        if platform_id in rel_data['platforms']:
            for vehicle in rel_data['platforms'][platform_id]:
                v_type = "Car"
                if "TRUCK" in pid or "SUV" in pid or "JEEP" in pid or "RAM" in pid or "LANDROVER" in pid or "F_SERIES" in platform_id or "SILVERADO" in str(vehicle).upper():
                    v_type = "Truck/SUV"
                
                entry["vehicles"].append({
                    "make": vehicle['make'],
                    "model": vehicle['model'],
                    "type": v_type,
                    "platform_id": platform_id
                })
    
    final_output.append(entry)

with open('docs/data/spare_tires.json', 'w', encoding='utf-8') as f:
    json.dump(final_output, f, indent=2)

print("Generated docs/data/spare_tires.json")
