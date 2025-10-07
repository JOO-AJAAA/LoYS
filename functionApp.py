from pandas import DataFrame

ordered_cols = [
    "Gender",
    "Age",
    "Height",
    "Weight",
    "family_history_with_overweight",
    "FAVC",
    "FCVC",
    "NCP",
    "CAEC",
    "SMOKE",
    "CH2O",
    "SCC",
    "FAF",
    "TUE",
    "CALC",
    "MTRANS"
]

Mapping_NObeyesdad = {
    0: 'Berat yang tidak mencukupi',
    1: 'Berat Badan Normal',
    2: 'Obesitas Tipe I',
    3: 'Obesitas Tipe II',
    4: 'Obesitas Tipe III',
    5: 'Kelebihan Berat Badan Tingkat I',
    6: 'Kelebihan Berat Badan Tingkat II'}

def preprocess(form_input):
  Mapping_Gender= {'Female': 0, 'Male': 1}
  Mapping_family_history_with_overweight= {'no': 0, 'yes': 1}
  Mapping_FAVC= {'no': 0, 'yes': 1}
  Mapping_CAEC= {'Always': 0, 'Frequently': 1, 'Sometimes': 2, 'no': 3}
  Mapping_SMOKE= {'no': 0, 'yes': 1}
  Mapping_SCC= {'no': 0, 'yes': 1}
  Mapping_CALC= {'Always': 0, 'Frequently': 1, 'Sometimes': 2, 'no': 3}
  Mapping_MTRANS= {'Automobile': 0, 'Bike': 1, 'Motorbike': 2, 'Public_Transportation': 3, 'Walking': 4}
  encoded = {
      "Gender": Mapping_Gender[form_input["gender"]],
      "Age": float(form_input["age"]),
      "Height": float(form_input["height"]),
      "Weight": float(form_input["weight"]),
      "family_history_with_overweight": Mapping_family_history_with_overweight[form_input["family_history"]],
      "FAVC": Mapping_FAVC[form_input["favc"]],
      "FCVC": float(form_input["fcvc"]),
      "NCP": float(form_input["ncp"]),
      "CAEC": Mapping_CAEC[form_input["caec"]],
      "SMOKE": Mapping_SMOKE[form_input["smoke"]],
      "CH2O": float(form_input["ch2o"]),
      "SCC": Mapping_SCC[form_input["scc"]],
      "FAF": float(form_input["faf"]),
      "TUE": float(form_input["tue"]),
      "CALC": Mapping_CALC[form_input["calc"]],
      "MTRANS": Mapping_MTRANS[form_input["mtrans"]],
    }
    # DataFrame sesuai urutan training
  df = DataFrame([[encoded[c] for c in ordered_cols]], columns=ordered_cols)
  return df
