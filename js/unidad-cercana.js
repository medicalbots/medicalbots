let map;
let service;
let directionsService;
let directionsRenderer;
let markers = [];
let infoWindow;
let lugaresEncontrados = [];
let userLocation;
let userMarker;
let autocomplete; // widget Autocomplete

// Mapa de tipos -> keyword / allowed google types para validación
const tipoMap = {
    "hospital": { keyword: "hospital", allowed: ["hospital"] },
    "clinica": { keyword: "clinic", allowed: ["health", "doctor", "clinic"] },
    "pharmacy": { keyword: "pharmacy", allowed: ["pharmacy", "drugstore"] },
    "centro de salud": { keyword: "health", allowed: ["health", "hospital", "doctor"] }
};

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 12.136389, lng: -86.251389 }, // fallback
        zoom: 14,
        gestureHandling: "greedy",
        disableDefaultUI: true, // quita controles (pegman / flechas)
        zoomControl: true // dejamos zoom
    });

    service = new google.maps.places.PlacesService(map);
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false });
    directionsRenderer.setMap(map);

    infoWindow = new google.maps.InfoWindow();

    // Geolocalización: ubicación en tiempo real (al cargar)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                map.setCenter(userLocation);
                colocarMarcadorUsuario();
                cargarTodosLosLugares();
            },
            (err) => {
                alert("No se pudo obtener tu ubicación. Habilita permisos.");
                // Si no hay ubicación, igualmente inicializamos autocomplete
                initAutocomplete();
            }
        );
    } else {
        initAutocomplete();
    }

    // Inicializar Autocomplete en la barra de búsqueda
    initAutocomplete();

    // Enter en input -> búsqueda por nombre (nearbySearch con keyword)
    const input = document.getElementById("busquedaNombre");
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            buscarPorNombre(input.value.trim());
        }
    });
}

// Inicializa el Autocomplete visual y su handler
function initAutocomplete() {
    const input = document.getElementById("busquedaNombre");
    if (!input) return;

    autocomplete = new google.maps.places.Autocomplete(input, {
        types: ["establishment"], // sugerir establecimientos
    });

    // pedimos campos para que devuelva geometry y demás
    autocomplete.setFields(["place_id", "name", "geometry", "formatted_address", "types", "vicinity"]);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place || !place.geometry) {
            // Si no tiene geometry, ignorar
            return;
        }

        // limpiar marcadores y lista (mostramos solo este lugar)
        limpiarMarcadores();
        limpiarResultadosUI();

        // crear marcador y centrar
        const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name
        });
        markers.push(marker);

        // añadir a la lista de resultados y dropdown
        lugaresEncontrados = [place];
        actualizarResultadosUI();

        map.setCenter(place.geometry.location);
        map.setZoom(16);
    });
}

function colocarMarcadorUsuario() {
    if (!userLocation) return;
    if (userMarker) userMarker.setMap(null);
    userMarker = new google.maps.Marker({
        position: userLocation,
        map,
        title: "Mi ubicación",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "blue",
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: "white"
        }
    });
}

function cargarTodosLosLugares() {
    if (!userLocation) {
        alert("Esperando tu ubicación...");
        return;
    }

    limpiarMarcadores();
    limpiarRuta();
    lugaresEncontrados = [];
    limpiarResultadosUI();

    // iterar por cada tipo definido en tipoMap
    Object.keys(tipoMap).forEach((tipo) => {
        const keyword = tipoMap[tipo].keyword;
        service.nearbySearch({
            location: userLocation,
            radius: 5000,
            keyword: keyword
        }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                results.forEach((place) => {
                    if (!place.geometry || !place.geometry.location) return;
                    // validar categoría más estricta
                    if (!validarCategoria(place, tipo)) return;

                    const marker = new google.maps.Marker({
                        map,
                        position: place.geometry.location,
                        title: place.name,
                        icon: getIcon(tipo)
                    });

                    marker.addListener("click", () => trazarRuta(place.geometry.location));
                    markers.push(marker);
                    lugaresEncontrados.push(place);
                });
                // actualizar UI después de procesar results
                actualizarResultadosUI();
            }
        });
    });
}

// Buscar por nombre (usado cuando presionan Enter en la barra)
function buscarPorNombre(query) {
    if (!query) return;
    if (!userLocation) {
        alert("Esperando tu ubicación...");
        return;
    }
    limpiarMarcadores();
    limpiarRuta();
    lugaresEncontrados = [];
    limpiarResultadosUI();

    // Buscar por keyword en un radius (nearbySearch)
    service.nearbySearch({
        location: userLocation,
        radius: 8000,
        keyword: query
    }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            results.forEach((place) => {
                if (!place.geometry || !place.geometry.location) return;
                // no filtrar por tipo aquí (usuario buscó nombre), pero puedes filtrar si deseas
                const marker = new google.maps.Marker({
                    map,
                    position: place.geometry.location,
                    title: place.name
                });
                marker.addListener("click", () => trazarRuta(place.geometry.location));
                markers.push(marker);
                lugaresEncontrados.push(place);
            });
            actualizarResultadosUI();
        } else {
            alert("No se encontraron resultados para: " + query);
        }
    });
}

// Filtrado por tipo (select)
function filtrarTipo() {
    const tipo = document.getElementById("tipoLugar").value;
    if (!tipo) {
        cargarTodosLosLugares();
        return;
    }

    if (!userLocation) {
        alert("Esperando tu ubicación...");
        return;
    }

    limpiarMarcadores();
    limpiarRuta();
    lugaresEncontrados = [];
    limpiarResultadosUI();

    const keyword = tipoMap[tipo] ? tipoMap[tipo].keyword : tipo;
    service.nearbySearch({
        location: userLocation,
        radius: 5000,
        keyword: keyword
    }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            results.forEach((place) => {
                if (!place.geometry || !place.geometry.location) return;
                if (!validarCategoria(place, tipo)) return;
                const marker = new google.maps.Marker({
                    map,
                    position: place.geometry.location,
                    title: place.name,
                    icon: getIcon(tipo)
                });
                marker.addListener("click", () => trazarRuta(place.geometry.location));
                markers.push(marker);
                lugaresEncontrados.push(place);
            });
            actualizarResultadosUI();
        }
    });
}

// Mejora de validación: revisa place.types o nombre para aceptar/rechazar
function validarCategoria(place, tipo) {
    if (!place) return false;
    const cfg = tipoMap[tipo];
    if (!cfg) return true; // si no hay configuración, aceptar

    // Si place.types existe, ver si intersecta con allowed
    if (Array.isArray(place.types) && place.types.length > 0) {
        const inter = place.types.filter(t => cfg.allowed.includes(t));
        if (inter.length > 0) return true;
    }

    // fallback: si el nombre contiene la palabra clave (clinic, hospital, farmacia, etc.)
    const name = (place.name || "").toLowerCase();
    if (name.includes(cfg.keyword.toLowerCase())) return true;

    // también verificar vicinity / formatted_address
    const vicinity = (place.vicinity || place.formatted_address || "").toLowerCase();
    if (vicinity.includes(cfg.keyword.toLowerCase())) return true;

    return false;
}

// Actualiza el dropdown y la lista visual de resultados
function actualizarResultadosUI() {
    const dropdown = document.getElementById("resultadosDropdown");
    const list = document.getElementById("resultsList");
    dropdown.innerHTML = '<option value="">Seleccione un resultado</option>';
    list.innerHTML = "";

    lugaresEncontrados.forEach((place, idx) => {
        // Dropdown
        const opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = `${place.name} - ${place.vicinity || place.formatted_address || ""}`;
        dropdown.appendChild(opt);

        // Lista visual con separación
        const item = document.createElement("div");
        item.className = "result-item";
        const meta = document.createElement("div");
        meta.className = "meta";
        const title = document.createElement("h4");
        title.textContent = place.name;
        const addr = document.createElement("p");
        addr.textContent = place.vicinity || place.formatted_address || "Dirección no disponible";
        meta.appendChild(title);
        meta.appendChild(addr);

        const btn = document.createElement("button");
        btn.textContent = "Ir";
        btn.onclick = () => {
            trazarRuta(place.geometry.location);
            map.panTo(place.geometry.location);
            map.setZoom(16);
        };

        item.appendChild(meta);
        item.appendChild(btn);
        list.appendChild(item);
    });
}

// Selección desde dropdown
function seleccionarResultado() {
    const idx = document.getElementById("resultadosDropdown").value;
    if (idx === "") return;
    const place = lugaresEncontrados[idx];
    if (!place) return;
    trazarRuta(place.geometry.location);
    map.panTo(place.geometry.location);
    map.setZoom(16);
}

// Buscar más cercano: toma el primer resultado (podemos mejorar cálculo de distancia)
function buscarMasCercano() {
    if (!lugaresEncontrados.length) {
        alert("Primero espera que se carguen los lugares.");
        return;
    }
    // calcular distancia mínima (metros)
    let minIdx = 0;
    let minDist = google.maps.geometry ?
        google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(userLocation.lat, userLocation.lng),
            lugaresEncontrados[0].geometry.location
        ) : Number.POSITIVE_INFINITY;

    for (let i = 1; i < lugaresEncontrados.length; i++) {
        const dist = google.maps.geometry ?
            google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(userLocation.lat, userLocation.lng),
                lugaresEncontrados[i].geometry.location
            ) : 0;
        if (dist < minDist) {
            minDist = dist;
            minIdx = i;
        }
    }

    const lugar = lugaresEncontrados[minIdx];
    trazarRuta(lugar.geometry.location);
    map.panTo(lugar.geometry.location);
    map.setZoom(16);
}

function centrarUbicacion() {
    if (userLocation) {
        map.setCenter(userLocation);
        map.setZoom(15);
    } else {
        alert("Ubicación no disponible.");
    }
}

function trazarRuta(destino) {
    if (!userLocation) {
        alert("Ubicación de usuario no disponible.");
        return;
    }
    directionsService.route({
        origin: userLocation,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        } else {
            alert("No se pudo calcular la ruta: " + status);
        }
    });
}

// Limpiar marcadores y lista
function limpiarMarcadores() {
    markers.forEach(m => m.setMap(null));
    markers = [];
}

function limpiarRuta() {
    directionsRenderer.set("directions", null);
}

// limpiar UI resultados (dropdown + lista)
function limpiarResultadosUI() {
    document.getElementById("resultadosDropdown").innerHTML = '<option value="">Seleccione un resultado</option>';
    document.getElementById("resultsList").innerHTML = '';
}

// Iconos por tipo
function getIcon(tipo) {
    switch ((tipo || "").toLowerCase()) {
        case "hospital": return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
        case "clinica": return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
        case "pharmacy": return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
        case "centro de salud": return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
        default: return "http://maps.google.com/mapfiles/ms/icons/pink-dot.png";
    }
}

/* Toggle menu (móvil) */
function toggleMenu() {
    const el = document.getElementById("menuOpciones");
    el.classList.toggle("show");
    el.setAttribute("aria-hidden", !el.classList.contains("show"));
}

/* Inicializar cuando la página carga */
window.onload = initMap;