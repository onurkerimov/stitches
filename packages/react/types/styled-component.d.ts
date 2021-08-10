import type * as Default from './default'
import type * as React from 'react'
import type * as Util from './util'

/** Returns a new Styled Component. */
export interface StyledComponent<
	Type = 'span',
	Props = {},
	Media = Default.Media,
	CSS = {},
	TransformedProps = TransformProps<Props, Media>
> extends React.ForwardRefExoticComponent<
	Util.Assign<
		Type extends React.ElementType
			? React.ComponentPropsWithRef<Type>
		: never,
		TransformedProps & { as?: Type } & { css?: CSS }
	>
> {
	<As = Type>(
		props: (
			As extends ''
				? { as: keyof JSX.IntrinsicElements }
			: As extends React.ComponentType<infer P>
				? Util.Assign<P, TransformedProps & { as: As }>
			: As extends keyof JSX.IntrinsicElements
				? Util.Assign<JSX.IntrinsicElements[As], TransformedProps & { as: As }>
			: never
		)
	): React.ReactElement | null

	className: string
	selector: string

	[$$StyledComponentType]: Type
	[$$StyledComponentProps]: Props
	[$$StyledComponentMedia]: Media
}

type InferLate<CSS extends {} = {}, Props extends {} = {}> = {
	[K in keyof Props]: K extends 'css' ? CSS : unknown
}

/** Returns a new CSS Component. */
export interface CssComponent<
	Type = 'span',
	Props = {},
	Media = Default.Media,
	CSS = {},
	TransformedProps = TransformProps<Props, Media>
> {
	(
		props?:
			& TransformedProps
			& {
				css?: CSS
			}
			& {
				[name in number | string]: any
			}
	): string & {
		className: string
		selector: string
		props: {}
	}

	className: string
	selector: string

	[$$StyledComponentType]: Type
	[$$StyledComponentProps]: Props
	[$$StyledComponentMedia]: Media
}

export type TransformProps<Props, Media> = {
	[K in keyof Props]: (
		| Props[K]
		| (
			& {
				[KMedia in Util.Prefixed<'@', 'initial' | keyof Media>]?: Props[K]
			}
			& {
				[KMedia in string]: Props[K]
			}
		)
	)
}

/** Unique symbol used to reference the type of a Styled Component. */
export declare const $$StyledComponentType: unique symbol

/** Unique symbol used to reference the type of a Styled Component. */
export type $$StyledComponentType = typeof $$StyledComponentType

/** Unique symbol used to reference the props of a Styled Component. */
export declare const $$StyledComponentProps: unique symbol

/** Unique symbol used to reference the props of a Styled Component. */
export type $$StyledComponentProps = typeof $$StyledComponentProps

/** Unique symbol used to reference the media passed into a Styled Component. */
export declare const $$StyledComponentMedia: unique symbol

/** Unique symbol used to reference the media passed into a Styled Component. */
export type $$StyledComponentMedia = typeof $$StyledComponentMedia

/** Returns a narrowed JSX element from the given tag name. */
type IntrinsicElement<TagName> = TagName extends keyof JSX.IntrinsicElements ? TagName : never

/** Returns a ForwardRef component. */
type ForwardRefExoticComponent<Type, Props> = React.ForwardRefExoticComponent<
	Util.Assign<
		Type extends React.ElementType
			? React.ComponentPropsWithRef<Type>
		: never,
		Props & { as?: Type }
	>
>

/** Returns the first Styled Component type from the given array of compositions. */
export type StyledComponentType<T extends any[]> = (
	T[0] extends never
		? 'span'
	: T[0] extends string
		? T[0]
	: T[0] extends (props: any) => any
		? T[0]
	: T[0] extends { [$$StyledComponentType]: unknown }
		? T[0][$$StyledComponentType]
	: T extends [lead: any, ...tail: infer V]
		? StyledComponentType<V>
	: never
)

/** Returns the cumulative variants from the given array of compositions. */
export type StyledComponentProps<T extends any[]> = (
	& (
		$$StyledComponentProps extends keyof T[0]
			? T[0][$$StyledComponentProps]
		: T[0] extends { variants: { [name: string]: unknown } }
			? {
				[K in keyof T[0]['variants']]?: Util.Widen<keyof T[0]['variants'][K]>
			}
		: {}
	)
	& (
		T extends [lead: any, ...tail: infer V]
			? StyledComponentProps<V>
		: {}
	)
)
