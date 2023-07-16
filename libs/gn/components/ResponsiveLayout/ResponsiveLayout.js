import React from 'react';
import './ResponsiveLayout.sass';

const FlexFrame = ({ children }) => (
	<div className="main-frame flex rframe">{children}</div>
)

const SideFrame = ({ children }) => (
	<div className="side-frame flex-none rframe">{children}</div>
)


const getChildLayout = ({ type, childs, align='', justify='' }) => {
	switch (type) {
		case "side-right":
			return (
				<div className={`gn-layout layout-wrap ${align} ${justify}`}>
					{childs.filter((d, i) => (i < childs.length - 1)).map((d, i) => (
						<FlexFrame key={i}>{d}</FlexFrame>
					))}
					<SideFrame>{childs[childs.length - 1]}</SideFrame>
				</div>
			)
		case "side-left":
			return (
				<div className={`container gn-layout layout-wrap ${align} ${justify}`}>
					<SideFrame>{childs[0]}</SideFrame>
					{childs.filter((d, i) => (i > 0)).map((d, i) => (
						<FlexFrame key={i}>{d}</FlexFrame>
					))}
				</div>
			)
		default:
			return (
				<div className={`container gn-layout wrap ${align} ${justify}`}>
					{childs.map((d, i) => (
						<FlexFrame key={i}>{d}</FlexFrame>
					))}
				</div>
			)
	}
}

const ResponsiveLayout = (props) => (
	<div className={`gn-responsive-layout ${props.className ? props.className : ''}`}>
		{getChildLayout(props)}
	</div>
)

ResponsiveLayout.types = {
	SIDE_LEFT: 'side-left',
	SIDE_RIGHT: 'side-right'
}
ResponsiveLayout.alignment = {
	CENTER:'align-center',
	LEFT:'align-left',
	RIGHT:'align-right'
}
ResponsiveLayout.justify = {
	CENTER:'justify-center',
	BETWEEN: 'justify-between',
	AROUND:'justify-around'
}

export default ResponsiveLayout;