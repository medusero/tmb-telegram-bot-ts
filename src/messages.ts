import { type BotCommand } from "grammy/types";

export const es = {
  common: {
    start: `Este bot puede obtener tiempos de llegadas de buses TMB.
Escribe /help para una lista de opciones disponibles.`,
    help: `Escribe un código de parada directamente.
Guarda una parada favorita con /save.
Lista tus favoritos con /favorites.
Borra una parada favorita con /delete.
Cancela una operación con /cancel.`,
    notRegistered: `Tu usuario no está registrado; contacta con el administrador del bot.`,
    aliasMustBeText: `Escríbeme el alias como mensaje de texto.`,
    askStopCode: `¿Cuál es el código de parada?`,
    codeMustBeText: `Escríbeme el código como mensaje de texto.`,
    cancelled: `Operación cancelada.`,
    askAlias: `¿Cuál es el alias de la parada?`,
    favoriteNotFound: `Ese favorito no existe.`,
    noFavoritesLeft: `No queda ningún favorito.`,
    deleteAnotherFavorite: `¿Quieres borrar otro favorito?`,
    noDataForStop: `Esta parada no tiene líneas con datos ahora mismo.`,
    noFavoritesSaved: `No tienes ningún favorito guardado.`,
    chooseFavoriteToDelete: `Elige qué favorito quieres borrar.`,
    notUnderstood: `No he entendido tu mensaje.`,
    unexpectedError: `Ha ocurrido un error no previsto.`,
  },
  templates: {
    favoriteSaved: (alias: string, code: string) =>
      `Favorito guardado: "${alias}" (parada ${code}).`,
    line: (lineName: string, arrivalTimesText: string) =>
      `Línea ${lineName}: ${arrivalTimesText}`,
  },
  commands: [
    { command: "help", description: `Muestra la ayuda.` },
    { command: "save", description: `Guarda una parada.` },
    { command: "favorites", description: `Lista tus paradas.` },
    { command: "delete", description: `Borra una parada.` },
    { command: "cancel", description: `Cancela la operación.` },
  ] as BotCommand[],
  errors: {
    common: {
      networkError: `No se pudo conectar con la API.`,
      invalidResponseShape: `La respuesta de la API no tiene el formato esperado.`,
      invalidJson: `La API no responde con ningún formato aceptable.`,
      timeout: `La API está tardando en responder.`,
      corruptFavoriteFile: `El archivo de favoritos está corrupto.`,
      invalidFavoriteShape: `El archivo de favoritos no tiene una forma reconocible.`,
      favoritesSaveError: `No se pudo guardar el archivo de favoritos.`,
      favoriteNotFound: `Ese alias no existe en el archivo.`,
    },
    templates: {
      tmbApiError: (status: number) =>
        `Error de la API: Código de estado ${status}`,
    },
  },
};

export const ca: typeof es = {
  common: {
    start: `Aquest bot pot consultar els temps d'arribada dels autobusos de TMB.
Escriu /help per veure la llista d'opcions disponibles.`,
    help: `Escriu un codi de parada directament.
Desa una parada com a favorita amb /save.
Llista els teus favorits amb /favorites.
Esborra una parada favorita amb /delete.
Cancel·la una operació amb /cancel.`,
    notRegistered: `El teu usuari no està registrat; contacta amb l'administrador del bot.`,
    aliasMustBeText: `Escriu-me l'àlies com a missatge de text.`,
    askStopCode: `Quin és el codi de la parada?`,
    codeMustBeText: `Escriu-me el codi com a missatge de text.`,
    cancelled: `Operació cancel·lada.`,
    askAlias: `Quin és l'àlies de la parada?`,
    favoriteNotFound: `Aquest favorit no existeix.`,
    noFavoritesLeft: `No queda cap favorit.`,
    deleteAnotherFavorite: `Vols esborrar un altre favorit?`,
    noDataForStop: `Aquesta parada no té línies amb dades ara mateix.`,
    noFavoritesSaved: `No tens cap favorit guardat.`,
    chooseFavoriteToDelete: `Tria quin favorit vols esborrar.`,
    notUnderstood: `No he entès el teu missatge.`,
    unexpectedError: `S'ha produït un error no previst.`,
  },
  templates: {
    favoriteSaved: (alias: string, code: string) =>
      `Favorit guardat: "${alias}" (parada ${code}).`,
    line: (lineName: string, arrivalTimesText: string) =>
      `Línia ${lineName}: ${arrivalTimesText}`,
  },
  commands: [
    { command: "help", description: `Mostra l'ajuda.` },
    { command: "save", description: `Desa una parada.` },
    { command: "favorites", description: `Llista les teves parades.` },
    { command: "delete", description: `Esborra una parada.` },
    { command: "cancel", description: `Cancel·la l'operació.` },
  ],
  errors: {
    common: {
      networkError: `No s'ha pogut connectar amb l'API.`,
      invalidResponseShape: `La resposta de l'API no té el format esperat.`,
      invalidJson: `L'API no respon amb cap format acceptable.`,
      timeout: `L'API està trigant a respondre.`,
      corruptFavoriteFile: `El fitxer de favorits està corromput.`,
      invalidFavoriteShape: `El fitxer de favorits no té una forma reconeixible.`,
      favoritesSaveError: `No s'ha pogut desar el fitxer de favorits.`,
      favoriteNotFound: `Aquest àlies no existeix al fitxer.`,
    },
    templates: {
      tmbApiError: (status: number) => `Error de l'API: Codi d'estat ${status}`,
    },
  },
};

export const en: typeof es = {
  common: {
    start: `This bot can check TMB bus arrival times.
Type /help for a list of available options.`,
    help: `Type a stop code directly.
Save a favorite stop with /save.
List your favorites with /favorites.
Delete a favorite stop with /delete.
Cancel an operation with /cancel.`,
    notRegistered: `Your user is not registered; contact the bot administrator.`,
    aliasMustBeText: `Send me the alias as a text message.`,
    askStopCode: `What's the stop code?`,
    codeMustBeText: `Send me the code as a text message.`,
    cancelled: `Operation cancelled.`,
    askAlias: `What's the alias for the stop?`,
    favoriteNotFound: `That favorite doesn't exist.`,
    noFavoritesLeft: `No favorites left.`,
    deleteAnotherFavorite: `Do you want to delete another favorite?`,
    noDataForStop: `This stop has no lines with data right now.`,
    noFavoritesSaved: `You don't have any favorites saved.`,
    chooseFavoriteToDelete: `Choose which favorite you want to delete.`,
    notUnderstood: `I didn't understand your message.`,
    unexpectedError: `An unexpected error has occurred.`,
  },
  templates: {
    favoriteSaved: (alias: string, code: string) =>
      `Favorite saved: "${alias}" (stop ${code}).`,
    line: (lineName: string, arrivalTimesText: string) =>
      `Line ${lineName}: ${arrivalTimesText}`,
  },
  commands: [
    { command: "help", description: `Show help.` },
    { command: "save", description: `Save a stop.` },
    { command: "favorites", description: `List your stops.` },
    { command: "delete", description: `Delete a stop.` },
    { command: "cancel", description: `Cancel the operation.` },
  ],
  errors: {
    common: {
      networkError: `Could not connect to the API.`,
      invalidResponseShape: `The API response doesn't have the expected format.`,
      invalidJson: `The API isn't responding with any acceptable format.`,
      timeout: `The API is taking too long to respond.`,
      corruptFavoriteFile: `The favorites file is corrupted.`,
      invalidFavoriteShape: `The favorites file doesn't have a recognizable shape.`,
      favoritesSaveError: `Could not save the favorites file.`,
      favoriteNotFound: `That alias doesn't exist in the file.`,
    },
    templates: {
      tmbApiError: (status: number) => `API error: status code ${status}`,
    },
  },
};
