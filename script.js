// Expor estado global simples para a página Locais (evita problemas de ordem de carregamento)
window.LIVING_LOCALS = window.LIVING_LOCALS || {
  gmap: null,
  gmarker: null,
  updateMap: null
}

// Callback chamado pela Google Maps API (deve existir antes do DOMContentLoaded)
window.initLocalsMap = function initLocalsMap() {
  const mapEl = document.getElementById('map')
  if (!mapEl) return

  const defaultPos = { lat: 41.157944, lng: -8.629105 } // Porto
  window.LIVING_LOCALS.gmap = new google.maps.Map(mapEl, {
    center: defaultPos,
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  })
  window.LIVING_LOCALS.gmarker = new google.maps.Marker({
    position: defaultPos,
    map: window.LIVING_LOCALS.gmap
  })

  // Se já houver seleção e função de atualização, reposiciona
  const countryEl = document.getElementById('country')
  const cityEl = document.getElementById('city')
  const ccode = countryEl ? countryEl.value : ''
  const ckey = cityEl ? cityEl.value : ''
  if (typeof window.LIVING_LOCALS.updateMap === 'function' && ccode) {
    window.LIVING_LOCALS.updateMap(ccode, ckey)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toTopButtons = document.querySelectorAll('.btn-to-top')

  function handleToTopClick(event) {
    event.preventDefault()
    // Smooth scroll to top of the document
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  if (toTopButtons && toTopButtons.length) {
    toTopButtons.forEach(btn => {
      btn.addEventListener('click', handleToTopClick)
    })
  }

  // Contacts form success modal handling
  const contactsForm = document.querySelector('.contact-card form')
  const successModalEl = document.getElementById('successModal')

  if (contactsForm && successModalEl) {
    const bsModal = new bootstrap.Modal(successModalEl)
    contactsForm.addEventListener('submit', e => {
      e.preventDefault()

      // Simple validation
      const nameEl = contactsForm.querySelector('#contact-name')
      const emailEl = contactsForm.querySelector('#contact-email')
      const messageEl = contactsForm.querySelector('#contact-message')

      let valid = true
      // reset validation state
      ;[nameEl, emailEl, messageEl].forEach(el =>
        el.classList.remove('is-invalid')
      )

      if (!nameEl.value.trim()) {
        nameEl.classList.add('is-invalid')
        valid = false
      }

      const emailValue = emailEl.value.trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailValue || !emailRegex.test(emailValue)) {
        emailEl.classList.add('is-invalid')
        valid = false
      }

      if (!messageEl.value.trim()) {
        messageEl.classList.add('is-invalid')
        valid = false
      }

      if (!valid) return

      // Everything valid — show modal and reset
      bsModal.show()
      contactsForm.reset()
    })
  }

  // ----------------------------
  // Página Locais: selects e Google Maps
  // ----------------------------
  const localsPage = document.body.classList.contains('locals-page')
  if (localsPage) {
    const countryEl = document.getElementById('country')
    const cityEl = document.getElementById('city')
    const viewBtn = document.querySelector('.locals-card .btn-brand')
    const mapBlock = document.getElementById('map-block')
    const laCity = document.getElementById('la-city')
    const laAddr = document.getElementById('la-address')
    const laEmail = document.getElementById('la-email')

    // Países e cidades (exemplo inicial; pode ser expandido depois)
    const DATA = {
      pt: {
        center: { lat: 38.736946, lng: -9.142685 }, // Lisboa
        cities: {
          Lisboa: {
            lat: 38.736946,
            lng: -9.142685,
            addr: 'Rua Augusta, 100\n1100-048 - Lisboa',
            email: 'livingaround_lisboa@living.com'
          },
          Porto: {
            lat: 41.157944,
            lng: -8.629105,
            addr: 'Rua da Alegria, 666\n4000-789 - Porto',
            email: 'livingaround_porto@living.com'
          },
          Coimbra: {
            lat: 40.203314,
            lng: -8.410257,
            addr: 'Largo da Portagem, 1\n3000-337 - Coimbra',
            email: 'livingaround_coimbra@living.com'
          }
        }
      },
      br: {
        center: { lat: -15.788497, lng: -47.879873 }, // Brasília
        cities: {
          São_Paulo: {
            lat: -23.55052,
            lng: -46.633308,
            addr: 'Av. Paulista, 1000\n01310-100 - São Paulo',
            email: 'livingaround_sp@living.com'
          },
          Rio_de_Janeiro: {
            lat: -22.906847,
            lng: -43.172897,
            addr: 'Av. Atlântica, 500\n22010-000 - Rio de Janeiro',
            email: 'livingaround_rio@living.com'
          },
          Brasília: {
            lat: -15.793889,
            lng: -47.882778,
            addr: 'Esplanada, 1\n70000-000 - Brasília',
            email: 'livingaround_bsb@living.com'
          }
        }
      },
      es: {
        center: { lat: 40.416775, lng: -3.70379 }, // Madrid
        cities: {
          Madrid: {
            lat: 40.416775,
            lng: -3.70379,
            addr: 'Puerta del Sol, 1\n28013 - Madrid',
            email: 'livingaround_madrid@living.com'
          },
          Barcelona: {
            lat: 41.3874,
            lng: 2.1686,
            addr: 'Passeig de Gràcia, 1\n08007 - Barcelona',
            email: 'livingaround_barcelona@living.com'
          }
        }
      }
    }

    function populateCities(countryCode) {
      cityEl.innerHTML = '<option value="" selected>cidade</option>'
      if (!countryCode || !DATA[countryCode]) return
      const entries = Object.keys(DATA[countryCode].cities)
      entries.forEach(name => {
        const opt = document.createElement('option')
        opt.value = name
        // Mostrar com espaços (ex.: São_Paulo -> São Paulo)
        opt.textContent = name.replace(/_/g, ' ')
        cityEl.appendChild(opt)
      })
    }

    if (countryEl) {
      countryEl.addEventListener('change', e => {
        populateCities(e.target.value)
      })
    }

    // Carregamento sob demanda da API do Google Maps
    let mapsLoading = false
    function loadGoogleMapsApi() {
      if (window.google && window.google.maps) return Promise.resolve()
      if (mapsLoading) {
        return new Promise(resolve => {
          const check = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(check)
              resolve()
            }
          }, 100)
        })
      }
      mapsLoading = true
      return new Promise(resolve => {
        const script = document.createElement('script')
        script.src =
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyCn2HTa0DD3JpoHtUyq4vYshc1pHtP3Qb8&callback=initLocalsMap'
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        document.head.appendChild(script)
      })
    }

    function updateMap(countryCode, cityKey) {
      const gmap = window.LIVING_LOCALS.gmap
      if (!gmap || !DATA[countryCode]) return
      const cities = DATA[countryCode].cities
      let pos = DATA[countryCode].center
      let cityNameToShow = ''
      let addr = ''
      let email = ''
      if (cityKey && cities[cityKey]) {
        pos = { lat: cities[cityKey].lat, lng: cities[cityKey].lng }
        cityNameToShow = cityKey.replace(/_/g, ' ')
        addr = cities[cityKey].addr
        email = cities[cityKey].email
      }
      gmap.setCenter(pos)
      gmap.setZoom(cityKey ? 12 : 6)
      if (window.LIVING_LOCALS.gmarker)
        window.LIVING_LOCALS.gmarker.setMap(null)
      window.LIVING_LOCALS.gmarker = new google.maps.Marker({
        position: pos,
        map: gmap
      })
      if (laCity) laCity.textContent = cityNameToShow || ''
      if (laAddr) laAddr.innerHTML = (addr || '').replace(/\n/g, '<br/>')
      if (laEmail) laEmail.textContent = email || ''
    }

    // Disponibiliza para o callback global usar
    window.LIVING_LOCALS.updateMap = updateMap

    if (viewBtn) {
      viewBtn.addEventListener('click', async () => {
        const ccode = countryEl ? countryEl.value : ''
        const ckey = cityEl ? cityEl.value : ''
        if (!ccode || !ckey) {
          alert('Escolha o país e a cidade antes de continuar.')
          return
        }
        if (mapBlock && mapBlock.classList.contains('d-none')) {
          mapBlock.classList.remove('d-none')
        }
        // Carrega a API sob demanda e inicializa/atualiza o mapa
        await loadGoogleMapsApi()
        if (!window.LIVING_LOCALS.gmap) {
          window.initLocalsMap()
        }
        window.LIVING_LOCALS.updateMap &&
          window.LIVING_LOCALS.updateMap(ccode, ckey)
      })
    }

    // Pré-seleção: Portugal / Porto e exibição do mapa ao carregar
    ;(async () => {
      if (!countryEl || !cityEl) return
      countryEl.value = 'pt'
      populateCities('pt')
      cityEl.value = 'Porto'
      if (mapBlock && mapBlock.classList.contains('d-none')) {
        mapBlock.classList.remove('d-none')
      }
      await loadGoogleMapsApi()
      if (!window.LIVING_LOCALS.gmap) {
        window.initLocalsMap()
      }
      window.LIVING_LOCALS.updateMap &&
        window.LIVING_LOCALS.updateMap('pt', 'Porto')
    })()
  }
})
