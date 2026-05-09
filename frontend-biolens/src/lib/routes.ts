const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export const routes = {
  crops: {
    // CRUD
    all:                  `${BACKEND}/api/crops/all`,
    create:               `${BACKEND}/api/crops/create`,
    byId:                 (id: number | string) => `${BACKEND}/api/crops/${id}`,
    update:               (id: number | string) => `${BACKEND}/api/crops/update/${id}`,
    delete:               (id: number | string) => `${BACKEND}/api/crops/delete/${id}`,
    logHarvest:           (id: number | string) => `${BACKEND}/api/crops/log-harvest/${id}`,
    findByStatus:         `${BACKEND}/api/crops/find-by-status`,
    filter:               `${BACKEND}/api/crops/filter`,
    // Diagnosis
    identify:             `${BACKEND}/api/crops/identify`,
    diagnose:             `${BACKEND}/api/crops/diagnose`,
    diagnoseForCrop:      (cropId: number | string) => `${BACKEND}/api/crops/diagnose/${cropId}`,
    diagnoseAuto:         `${BACKEND}/api/crops/diagnose-auto`,
    diagnoses:            `${BACKEND}/api/crops/diagnoses`,
    diagnosesByCrop:      (cropId: number | string) => `${BACKEND}/api/crops/${cropId}/diagnoses`,
    identificationHistory:(cropId: number | string) => `${BACKEND}/api/crops/identification-history/${cropId}`,
    usage:                `${BACKEND}/api/crops/usage`,
  },
  export: {
    pdf:     `${BACKEND}/api/export/pdf`,
    excel:   `${BACKEND}/api/export/excel`,
    geojson: `${BACKEND}/api/export/geojson`,
  },
  weather: {
    current: `${BACKEND}/api/weather`,
  },
  users: {
    login:       `${BACKEND}/api/users/login`,
    register:    `${BACKEND}/api/users/register`,
    profile:     `${BACKEND}/api/users/profile`,
    isActive:    `${BACKEND}/api/users/isActive`,
    findByEmail: `${BACKEND}/api/users/find-by-email`,
  },
}
