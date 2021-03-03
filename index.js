const searchHelper = document.querySelector('.search-helper')
const searchInput = document.querySelector('#search-input')
const info = document.querySelector('.info')

const state = {
	search: [],
	info: []

}
const render = () => {
	const search = state.search?.map(item => `<li id=${item.id}>${item.name}</li>`)
	const listGroup = state.info?.map(item => `<li class="list-item" id=${item.id}>
						<div class="list-info">
							<span>Name: ${item.name}</span>
							<span>Owner: ${item.owner.login}</span>
							<span>Stars: ${item.stargazers_count}</span>
						</div>
						<span class="list-icon">&#10006;</span>
					</li>`
	)

	searchHelper.innerHTML = `<ul>${search?.join('')}</ul>`
	info.innerHTML = `<ul class="list-group">${listGroup.join('')}</ul>`
}

const debounce = (fn, debounceTime) => {
	let timeout
	return function () {
		const fnCall = () => {
			fn.apply(this, arguments)
		}
		clearTimeout(timeout)
		timeout = setTimeout(fnCall, debounceTime)
	}
}

const fetchRequest = async req => {
	const res = await fetch(`https://api.github.com/search/repositories?q=${req.trim()}&sort=stars&order=desc&per_page=5`)
	const data = await res.json()
	return data
}

const onChange = async e => {
	if (e.target.value.trim() === '') {
		state.search = []
		render()
		return
	}
	const data = await fetchRequest(e.target.value)
	state.search = data.items
	render()
}

const onClickSearchHelper = e => {

	const click = state.search.filter(item => item.id === +e.target.id)
	state.info.push(click[0])
	state.search = []
	searchInput.value = ''
	render()
}

const onClickInfo = e => {
	if(e.target.className !== 'list-icon') return
	state.info = state.info.filter(item => item.id !== +e.target.parentNode.id)
	render()
}

const onChangeDebounce = debounce(onChange, 50)



searchInput.addEventListener('input', onChangeDebounce)
searchHelper.addEventListener('click', onClickSearchHelper)
info.addEventListener('click', onClickInfo)
