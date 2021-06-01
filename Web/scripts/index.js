const jobs = []

const modalContainer = document.getElementById('modal-container')

function renderJobs() {
  let indexCount = 1
  const tbody = document.getElementsByTagName('tbody')[0]

  tbody.innerHTML = ''

  jobs.forEach(job => {
    const tr = document.createElement('tr')

    const indexTd = document.createElement('td')
    indexTd.classList.add('td-index')
    indexTd.innerText = indexCount
    indexCount++
    tr.appendChild(indexTd)

    const titleTd = document.createElement('td')
    titleTd.classList.add('td-title')
    titleTd.innerText = job.name
    tr.appendChild(titleTd)

    const prizeTd = document.createElement('td')
    prizeTd.classList.add('td-prize')
    prizeTd.classList.add('td-double-text')
    const prizeSpan = document.createElement('span')
    prizeSpan.innerText = 'PRAZO'
    prizeTd.appendChild(prizeSpan)
    const prizeP = document.createElement('p')
    prizeP.innerText = job.status === 'in-progress'
    ? `${new Date().getDate() - new Date(job.created_at).getDate()} dias para a entrega`
    : "0 dias para a entrega"
    prizeTd.appendChild(prizeP)
    tr.appendChild(prizeTd)

    const valueTd = document.createElement('td')
    valueTd.classList.add('td-value')
    valueTd.classList.add('td-double-text')
    const valueSpan = document.createElement('span')
    valueSpan.innerText = 'VALOR'
    valueTd.appendChild(valueSpan)
    const valueP = document.createElement('p')
    valueP.innerText = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(job.value)
    valueTd.appendChild(valueP)
    tr.appendChild(valueTd)

    const statusTd = document.createElement('td')
    statusTd.classList.add('td-status')
    statusTd.classList.add(job.status)
    const statusDiv = document.createElement('div')
    statusDiv.innerText = job.status
    statusTd.appendChild(statusDiv)
    tr.appendChild(statusTd)

    const buttonTd = document.createElement('td')
    buttonTd.classList.add('td-buttons')
    const updateButton = document.createElement('button')
    const updateIcon = document.createElement('img')
    updateIcon.setAttribute('src', '../assets/edit-3.svg')
    updateButton.appendChild(updateIcon)
    buttonTd.appendChild(updateButton)

    const deleteButton = document.createElement('button')
    const deleteIcon = document.createElement('img')
    deleteIcon.setAttribute('src', '../assets/trash.svg')
    deleteButton.appendChild(deleteIcon)
    buttonTd.appendChild(deleteButton)

    tr.appendChild(buttonTd)

    feather.replace()

    tbody.appendChild(tr)
  })
}

function checkJobInProgress(job) {
  const days = Math.ceil(job.total_time / job.dedicated_time)

  const jobCreation = new Date(job.created_at)

  const now = new Date(
    new Date().getFullYear(), 
    new Date().getMonth(), 
    new Date().getDate()
  )

  const endDate = new Date(
    jobCreation.getFullYear(), 
    jobCreation.getMonth(), 
    jobCreation.getDate() + days
  )

  return now < endDate
}

function listJobs() {
  fetch('http://localhost:3333/jobs')
  .then((response) => response.json())
  .then((responseJobs) => {
    let endedJobsCount = 0
    document.getElementById('total-jobs').innerText = responseJobs.length

    const inProgressJobsCount = responseJobs.reduce((acc, job) => {
      
      const isInProgress = checkJobInProgress(job)

      if (isInProgress) {
        jobs.push({...job, status: 'in-progress'})

        return acc + 1
      }

      jobs.push({...job, status: 'ended'})
      endedJobsCount++

      return acc
    }, 0)

    document.getElementById('in-progress-jobs-count').innerText = inProgressJobsCount
    document.getElementById('ended-jobs-count').innerText = endedJobsCount

    renderJobs()
  })
}

listJobs()

function closeModal() {
  modalContainer.remove()
}

function openModal() {
  document.body.appendChild(modalContainer)
}

closeModal()

function handleSubmit(e) {
  e.preventDefault()
  
  const name = e.target[0].value
  const dedicated_time = Number(e.target[1].value)
  const total_time = Number(e.target[2].value)
  const value = total_time * 75

  fetch('http://localhost:3333/jobs', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      dedicated_time,
      total_time,
      value
    })
  }).then(response => response.json())
    .then(data => {
      jobs.push({...data, status: 'in-progress'})

      renderJobs()

      document.getElementById('total-jobs').innerText = jobs.length
      document.getElementById('in-progress-jobs-count').innerText = Number(document.getElementById('in-progress-jobs-count').innerText) + 1

      closeModal()
    })
}

function handleSubmitButtonClick() {
  const form = document.getElementsByTagName('form')[0]

  form.dispatchEvent(new Event('submit'))
}