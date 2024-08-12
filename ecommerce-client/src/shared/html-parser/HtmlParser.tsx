import parse, { DOMNode, Element, HTMLReactParserOptions } from 'html-react-parser';
import { FC, ReactElement } from 'react';
import { IHtmlParserProps } from '~shared/shared.interface';

const HtmlParser: FC<IHtmlParserProps> = (): ReactElement => {
  const parser = (input: string) => {
    const options: HTMLReactParserOptions = {
      replace: (domNode: DOMNode) => {
        if (domNode instanceof Element && domNode.firstChild && (domNode.firstChild as never)['name'] === 'br') {
          return <></>;
        }
        return <>{parse(input, options)}</>;
      }
    };
  };
  return <div>HtmlParser</div>;
};

export default HtmlParser;
