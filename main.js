const data = {
  allUsersData: [],
  aliveUsersPicked: [],
  searchResult: []
}

const config = {
  apiURL: 'https://lighthouse-user-api.herokuapp.com/api/v1/users',
  searchingStatus: false,
  displaySettings: {
    // mode: user per page
    list: 12,
    grid: 9
  },
  nowLiveAccounts: '',
  displayStatus: 'list',
  startPage: 1,
  currentPage: 1
}

const elementObject = {
  liveAccountsNumberDisplay: document.querySelector(
    '#liveAccountsNumberDisplay'
  ),
  searchInput: document.querySelector('#searchInput'),
  searchButton: document.querySelector('#searchButton'),
  searchResultHint: document.querySelector('#searchResultHint'),
  searchResultClearButton: document.querySelector('#searchResultClearButton'),
  displaySettingSwitch: document.querySelector('#headerDisplaySetting'),
  mainUserContainer: document.querySelector('#mainUserContainer'),
  userModal: document.querySelector('#userModal'),
  pagination: document.querySelector('#pagination')
}

const view = {
  displayLiveAccountNumbers(number) {
    elementObject.liveAccountsNumberDisplay.innerText = number
  },
  displayUsers(data, userPerPage) {
    let friendsListInnerHTML = ''
    // 根據list或grid模式產生不同內容
    switch (config.displayStatus) {
      case 'list':
        friendsListInnerHTML = '<div id="display-style-list">'
        for (let i = 0; i < userPerPage; i++) {
          if (data[i].live === true) {
            friendsListInnerHTML += `
            <div data-bs-toggle='modal' data-bs-target='#userModal' data-user='${data[i].id}' data-status='onair'>
              <span class='badge bg-onair'>ON AIR</span>
              <img src='${data[i].avatar}'>
              <p>${data[i].name} ${data[i].surname}</p>
            </div>`
          } else {
            friendsListInnerHTML += `
            <div data-bs-toggle='modal' data-bs-target='#userModal' data-user='${data[i].id}' data-status='off'>
              <span class='badge bg-off'>OFF</span>
              <img src='${data[i].avatar}'>
              <p>${data[i].name} ${data[i].surname}</p>
            </div>`
          }
        }
        friendsListInnerHTML += '</div>'
        break
      case 'grid':
        friendsListInnerHTML = '<div id="display-style-grid">'
        for (let i = 0; i < userPerPage; i++) {
          if (data[i].live === true) {
            friendsListInnerHTML += `
            <div data-bs-toggle='modal' data-bs-target='#userModal' data-user='${data[i].id}' data-status='onair'>
              <span class='badge bg-onair'>ON AIR</span>
              <img src='${data[i].avatar}'>
              <p>${data[i].name} ${data[i].surname}</p>
            </div>`
          } else {
            friendsListInnerHTML += `
            <div data-bs-toggle='modal' data-bs-target='#userModal' data-user='${data[i].id}' data-status='off'>
              <span class='badge bg-off'>OFF</span>
              <img src='${data[i].avatar}'>
              <p>${data[i].name} ${data[i].surname}</p>
            </div>`
          }
        }
        friendsListInnerHTML += '</div>'
        break
    }
    elementObject.mainUserContainer.innerHTML = friendsListInnerHTML
  },
  displayPagination(totalUser, userPerPage) {
    const totalPages = Math.ceil(totalUser / userPerPage)
    // Previous
    let paginationInnerHTML = `
      <li class='page-item disabled'>
        <a class='page-link' href='#' aria-label='Previous' data-page='p'>
          <span aria-hidden='true'>&laquo;</span>
        </a>
      </li>`
    // 數字頁
    for (let i = 1; i <= totalPages; i++) {
      i === config.startPage
        ? (paginationInnerHTML += `
        <li class='page-item active'>
          <a class='page-link' href='#' data-page='${i}'>${i}</a>
        </li>`)
        : (paginationInnerHTML += `
        <li class='page-item'>
          <a class='page-link' href='#' data-page='${i}'>${i}</a>
        </li>`)
    }
    // Next
    paginationInnerHTML += `
      <li class='page-item'>
        <a class='page-link' href='#' aria-label='Next' data-page='n'>
          <span aria-hidden='true'>&raquo;</span>
        </a>
      </li>`
    elementObject.pagination.innerHTML = paginationInnerHTML
  },
  displayModal(data, CountryFlag, target, status) {
    let headerOnlineStatusClass = ''
    let headerOnlineStatusBadgeText = ''
    let bodyOnlineStatusDescription = ''
    let bodyOnlineStatusClass = ''
    let bodyRadioDescription = ''
    switch (status) {
      case 'onair':
        headerOnlineStatusClass = 'bg-onair'
        headerOnlineStatusBadgeText = 'ON AIR'
        bodyOnlineStatusDescription = 'is ON LINE NOW!'
        bodyOnlineStatusClass = 'on-air'
        bodyRadioDescription =
          '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates quaerat id perspiciatis libero unde rem!</p>'
        break
      case 'off':
        headerOnlineStatusClass = 'bg-off'
        headerOnlineStatusBadgeText = 'OFF'
        bodyOnlineStatusDescription = 'is offline currently.'
    }
    target.innerHTML = `
        <div class='modal-dialog'>
          <div class='modal-content'>
            <div class='modal-header'>
              <span class='badge ${headerOnlineStatusClass}'>${headerOnlineStatusBadgeText}</span>
              <h2 class='modal-title'><span class='modal-flag'>${CountryFlag}</span>${data.name} ${data.surname}</h2>
              <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div class='modal-body'>
              <div class='modal-body-avatar ${bodyOnlineStatusClass}'>
                <img src='${data.avatar}' alt='modal body avatar'>
              </div>
              <div class='modal-body-description'>
                <p>${data.name} ${bodyOnlineStatusDescription}</p>
                ${bodyRadioDescription}
                <div class='modal-body-social-media'>
                  <i class='bi bi-facebook'></i>
                  <i class='bi bi-twitter'></i>
                  <i class='bi bi-instagram'></i>
                </div>
              </div>
            </div>
            <div class='modal-footer'>
              <button type='button' class='btn btn-primary' data-bs-dismiss='modal'>Close</button>
            </div>
          </div>
        </div>`
  },
  updatePagination(pageNumber) {
    if (!isNaN(pageNumber)) pageNumber = Number(pageNumber)
    switch (pageNumber) {
      case undefined:
        return
      case 'p':
        document.querySelector('.page-item.active').classList.remove('active')
        document
          .querySelector(`[data-page='${config.currentPage}']`)
          .parentElement.classList.add('active')
        // 抵達第一頁
        if (config.currentPage === 1) {
          elementObject.pagination.firstElementChild.classList.add('disabled')
        }
        // 離開最後一頁
        if (
          config.currentPage ===
          Math.ceil(
            data.allUsersData.length /
            config.displaySettings[config.displayStatus]
          ) -
          1
        ) {
          elementObject.pagination.lastElementChild.classList.remove(
            'disabled'
          )
        }
        return
      case 'n':
        document.querySelector('.page-item.active').classList.remove('active')
        document
          .querySelector(`[data-page='${config.currentPage}']`)
          .parentElement.classList.add('active')
        // 從第一頁離開
        if (config.currentPage === 2) {
          elementObject.pagination.firstElementChild.classList.remove(
            'disabled'
          )
        }
        // 抵達最後一頁
        if (
          config.currentPage ===
          Math.ceil(
            data.allUsersData.length /
            config.displaySettings[config.displayStatus]
          )
        ) {
          elementObject.pagination.lastElementChild.classList.add('disabled')
        }
        return
      case 1:
        // 點到第一頁
        document.querySelector('.page-item.active').classList.remove('active')
        document
          .querySelector(`[data-page='${config.currentPage}']`)
          .parentElement.classList.add('active')
        elementObject.pagination.firstElementChild.classList.add('disabled')
        elementObject.pagination.lastElementChild.classList.remove('disabled')
        return
      case Math.ceil(
        data.allUsersData.length / config.displaySettings[config.displayStatus]
      ):
        // 點到最後一頁
        document.querySelector('.page-item.active').classList.remove('active')
        document
          .querySelector(`[data-page='${config.currentPage}']`)
          .parentElement.classList.add('active')
        elementObject.pagination.firstElementChild.classList.remove('disabled')
        elementObject.pagination.lastElementChild.classList.add('disabled')
        return
      default:
        // 其他數字頁
        document.querySelector('.page-item.active').classList.remove('active')
        document
          .querySelector(`[data-page='${config.currentPage}']`)
          .parentElement.classList.add('active')
        elementObject.pagination.firstElementChild.classList.remove('disabled')
        elementObject.pagination.lastElementChild.classList.remove('disabled')
    }
  },
  updateUI(userData, currentPage, displaySetting) {
    this.displayPagination(userData.length, displaySetting)
    this.updatePagination(currentPage)
    controller.getUserForPage(currentPage)
  },
  clearSearchResult() {
    elementObject.searchInput.value = ''
    // 結束搜尋狀態
    config.searchingStatus = false
    elementObject.searchResultClearButton.classList.add('d-none')
    elementObject.searchResultHint.innerText = ''
    this.displayUsers(
      data.aliveUsersPicked,
      config.displaySettings[config.displayStatus]
    )
    this.displayPagination(
      data.aliveUsersPicked.length,
      config.displaySettings[config.displayStatus]
    )
  }
}

const controller = {
  randomNowLiveAccountsNumber(min, max) {
    // 5-10人
    config.nowLiveAccounts = Math.floor(Math.random() * (max - min)) + min
  },
  fetchUserData(url) {
    // fetch data from api, add to array data.allUsersData
    axios
      .get(url)
      .then((response) => {
        data.allUsersData.push(...response.data.results)
        this.addFullName(data.allUsersData)
        // random pick live users
        const pickLived = this.randomPickLiveAccounts(
          config.nowLiveAccounts,
          data.allUsersData
        )
        // generate pagination and display users
        view.displayPagination(
          data.allUsersData.length,
          config.displaySettings[config.displayStatus]
        )
        view.displayUsers(
          pickLived,
          config.displaySettings[config.displayStatus]
        )
      })
      .catch((err) => console.log(err))
  },
  addFullName(userArray) {
    userArray.forEach((user) => {
      user.fullName = `${user.name.toLowerCase()} ${user.surname.toLowerCase()}`
    })
  },
  fetchUserModal(userID, userStatus) {
    // fetch data by user id
    axios
      .get(`${config.apiURL}/${userID}`)
      .then(function (response) {
        // get country code
        const countryCode = response.data.region
        const flagEmoji = controller.getFlagByCountryCode(countryCode)
        view.displayModal(
          response.data,
          flagEmoji,
          elementObject.userModal,
          userStatus
        )
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  getFlagByCountryCode(countryCode) {
    const rawData = countryFlagEmoji.get(countryCode)
    return rawData.emoji
  },
  randomPickLiveAccounts(liveAccounts, allUsers) {
    // 在allUsers中隨機挑選「liveAccounts」位使用者
    const pickedUserID = Array.from(
      { length: liveAccounts },
      () => Math.floor(Math.random() * allUsers.length) + 1
    )
    // 複製一個allUsers陣列，避免影響原始資料
    data.aliveUsersPicked.push(...allUsers)
    // 把挑選出來的ID往陣列最前端推進
    pickedUserID.forEach((index) => {
      const template = data.aliveUsersPicked[index]
      // 加上live的flag
      template.live = true
      data.aliveUsersPicked.splice(index, 1)
      data.aliveUsersPicked.unshift(template)
    })
    return data.aliveUsersPicked
  },
  getUserForPage(pageNumber) {
    if (pageNumber !== undefined) {
      let users
      config.searchingStatus
        ? (users = data.searchResult.slice(
          (config.currentPage - 1) *
          config.displaySettings[config.displayStatus],
          config.currentPage * config.displaySettings[config.displayStatus]
        ))
        : (users = data.aliveUsersPicked.slice(
          (config.currentPage - 1) *
          config.displaySettings[config.displayStatus],
          config.currentPage * config.displaySettings[config.displayStatus]
        ))
      view.displayUsers(users, users.length)
    }
  },
  updateDisplaySetting(displayStyle) {
    config.displayStatus = displayStyle
  },
  updateCurrentPage(pageNumber) {
    switch (pageNumber) {
      case undefined:
        return
      case 'p':
        config.currentPage -= 1
        return
      case 'n':
        config.currentPage += 1
        return
      default:
        config.currentPage = Number(pageNumber)
    }
  },
  setMaxPageNumber(pageNumber) {
    // 取每頁數量：[12, 9]
    const displaySettings = Object.values(config.displaySettings)
    let maxPageInDifferentLayout
    // 取總頁數（陣列）
    config.searchingStatus
      ? (maxPageInDifferentLayout = displaySettings.map((value) =>
        Math.ceil(data.searchResult.length / value)
      ))
      : (maxPageInDifferentLayout = displaySettings.map((value) =>
        Math.ceil(data.allUsersData.length / value)
      ))
    const pageNumberLimit = Math.min(...maxPageInDifferentLayout)
    if (!isNaN(pageNumber) && pageNumber > pageNumberLimit) pageNumber = pageNumberLimit
    return pageNumber
  },
  search(rawUserInputs) {
    if (controller.inputValueVerify(rawUserInputs)) {
      config.searchingStatus = true
      const userInput = rawUserInputs.trim().toLowerCase()
      data.searchResult = data.aliveUsersPicked.filter(
        (user) => user.fullName.includes(userInput) === true
      )
      config.currentPage = controller.setMaxPageNumber(config.currentPage)
      // 顯示搜尋提示
      data.searchResult.length === 0
        ? (elementObject.searchResultHint.innerHTML = `No matching result(s) of keyword(s): '<span class='fw-bold'>${rawUserInputs}</span>'`)
        : (elementObject.searchResultHint.innerHTML = `${data.searchResult.length} result(s) of keyword(s): '<span class='fw-bold'>${rawUserInputs}</span>'`)
      // 展示搜尋結果
      view.displayPagination(
        data.searchResult.length,
        config.displaySettings[config.displayStatus]
      )
      this.getUserForPage(config.currentPage)
      elementObject.searchResultClearButton.classList.remove('d-none')
    }
  },
  inputValueVerify(rawUserInputs) {
    return rawUserInputs !== '' && rawUserInputs.trim() !== ''
  }
}

// js載入後，決定上線DJ人數，並向api取資料，產生第一頁內容
controller.randomNowLiveAccountsNumber(5, 11)
view.displayLiveAccountNumbers(config.nowLiveAccounts)
controller.fetchUserData(config.apiURL)

// 更新modal內容
elementObject.mainUserContainer.addEventListener('click', (event) => {
  let userID = event.target.dataset.user
  if (userID === undefined) userID = event.target.parentElement.dataset.user
  let userStatus = event.target.dataset.status
  if (userStatus === undefined) userStatus = event.target.parentElement.dataset.status
  controller.fetchUserModal(userID, userStatus)
})

// 切換顯示格式
elementObject.displaySettingSwitch.addEventListener('click', (event) => {
  const displayStyle = event.target.dataset.style
  if (displayStyle === config.displayStatus) return
  // 更新顯示格式
  controller.updateDisplaySetting(displayStyle)
  config.currentPage = controller.setMaxPageNumber(config.currentPage)
  // 是否在搜尋狀態下切換顯示格式
  config.searchingStatus
    ? view.updateUI(
      data.searchResult,
      config.currentPage,
      config.displaySettings[config.displayStatus]
    )
    : view.updateUI(
      data.allUsersData,
      config.currentPage,
      config.displaySettings[config.displayStatus]
    )
})

// 換頁
elementObject.pagination.addEventListener('click', (event) => {
  let pageNumber = event.target.dataset.page
  if (pageNumber === undefined) pageNumber = event.target.parentElement.dataset.page // p, n or undefined
  controller.updateCurrentPage(pageNumber)
  view.updatePagination(pageNumber)
  controller.getUserForPage(pageNumber)
})

// 搜尋
elementObject.searchButton.addEventListener('click', (event) => {
  controller.search(elementObject.searchInput.value)
})
elementObject.searchInput.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) elementObject.searchButton.click()
})

// 移除搜尋結果
elementObject.searchResultClearButton.addEventListener('click', () => {
  view.clearSearchResult()
})
