/**
 * Tipos (JSDoc) de las respuestas del backend.
 * El proyecto usa JavaScript; estos typedefs documentan los contratos de API.
 */

/**
 * @typedef {Object} ApiResponse
 * @property {Object} data - payload de la respuesta
 * @property {number} status - código HTTP
 * @property {Object} headers
 * @property {Object} config
 */

/**
 * @typedef {Object} CaregiverDto
 * @property {string} id
 * @property {string} name
 * @property {string} lastname
 * @property {string} phone
 * @property {string} imageUrl
 * @property {string} email
 * @property {string} plan
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {CaregiverDto} caregiver
 */

/**
 * @typedef {Object} TokenPayload
 * @property {string} [nameid]
 * @property {string} [email]
 * @property {string} [name]
 * @property {string} [Plan]
 * @property {number} [exp]
 * @property {string} [iss]
 * @property {string} [aud]
 */

export {};
