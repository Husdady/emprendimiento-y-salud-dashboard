/**
 * Obtener las opciones disponibles para ordenar los productos
 * @param {types: Object}
 * @returns Object
 */
export function getProductsSortOptions({ types }) {
	return {
    date: [
      {
        key: types.sortByMostRecentCreatedAt,
        value: "Ordenar por fecha de creación más reciente",
      },
      {
        key: types.sortByOldestCreatedAt,
        value: "Ordenar por fecha de creación más antigua",
      },
      {
        key: types.sortByMostRecentUpdatedAt,
        value: "Ordenar por fecha de actualización más reciente",
      },
      {
        key: types.sortByOldestUpdatedAt,
        value: "Ordenar por fecha de actualización más antigua",
      },
    ],
    default: [
      {
        key: types.sortByAscName,
        value: "Ordenar por nombre ascendente",
      },
      {
        key: types.sortByDescName,
        value: "Ordenar por nombre descendente",
      },
      {
        key: types.sortByHighestStock,
        value: "Ordenar por stock mayor",
      },
      {
        key: types.sortByMinorStock,
        value: "Ordenar por stock menor",
      },
    ],
  };
} 