import React from 'react';
import queryString from 'query-string';
import _ from 'lodash';
import './Pagination.sass';

let med = 6

const generateHref = (page, hrefOption) => {
	return `${hrefOption.base}?${queryString.stringify(
		(() => {
			let q = _.clone(hrefOption.query)
			q.page = page;
			return q;
		})()
	)}`
}

const generatePage = (page, size, total, hrefOption) => {
	let pages = [];    
	page = Number(page);
	let min = page - med;

	if(page > 1){
		pages.push({
			value: '|<',
			href: generateHref(1, hrefOption)
		})
	}    

	if(min <= 0) {
			// med += Math.abs(min - 1)        
			min = 1;
	}

	if(min > 1) {
		pages.push({
			value:'<',
			href: generateHref(min - 1, hrefOption)
		})
	}

	let max = page + med;
	let tot = total/size; //12

	max = max > tot ? tot : max;
	
	for(let p = min ; p < Math.ceil(max) ; p++){
			pages.push({
					value:p,
					href:generateHref(p, hrefOption)
			})
	}

	if(tot > max) pages.push({
			value:'>',
			href: generateHref(max+1, hrefOption)
	})

	if(page < Math.ceil(tot)){
		pages.push({
			value: '>|',
			href: generateHref(Math.ceil(tot), hrefOption)
		})
	}

	
	return pages;
} 

const getMax = (page, size, total) => {
	return total < size ? total : (page * size);
}

const Pagination = ({ page, size, total, className, hrefOption }) => (
	<div className={`gn-pagination ${className ? className : ''}`}>
		<div className="paging">
			{generatePage(page, size, total, hrefOption).map((d, i) => (
				<li key={i} className={`${d.value == page ? 'active' : ''}`}>
					<a href={d.href}>
						{d.value}
					</a>
				</li>
			))}
		</div>
	</div>
)

Pagination.defaultProps = {
	page: 1,
	size: 20,
	total: 0,
	hrefOption:{
		base: '',
		query: {}
	}
}

export default Pagination;