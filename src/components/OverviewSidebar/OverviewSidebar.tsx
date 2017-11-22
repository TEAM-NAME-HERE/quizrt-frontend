import * as React from 'react';
import Card, { CardHeader, CardActions } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowDown from 'material-ui-icons/KeyboardArrowDown';
import KeyboardArrowUp from 'material-ui-icons/KeyboardArrowUp';

interface Item {
  id: string;
  name: string;
}

export interface Props {
  items: Item[];
  onChange: (items: Item[]) => void;
  style?: React.CSSProperties;
  className?: string;
}

class OverviewSidebar extends React.Component<Props> {
  static defaultProps = {
    items: [{
      text: '',
      id: '',
    }]
  };

  constructor(p: Props) {
    super(p);
  }

  handleUp = (id: string) => (e: React.MouseEvent<HTMLButtonElement & HTMLAnchorElement>) => {
    const { items } = this.props;
    const idx = items.findIndex(i => i.id === id);
    if (idx !== 0) {
      const temp = items[idx];
      items[idx] = items[idx - 1];
      items[idx - 1] = temp;
    }

    this.props.onChange(items);
  }

  handleDown = (id: string) => (e: React.MouseEvent<HTMLButtonElement & HTMLAnchorElement>) => {
    const { items } = this.props;
    const idx = items.findIndex(i => i.id === id);
    if (idx !== items.length - 1) {
      const temp = items[idx];
      items[idx] = items[idx + 1];
      items[idx + 1] = temp;
    }

    this.props.onChange(items);
  }

  render() {
    const { items, style, className } = this.props;
    return (
      <div
        style={style ? style : {height: '100%', overflow: 'auto', padding: 10}}
        className={className ? className : ''}
      >
        {items.map(i => (
          <Card style={{marginBottom: 10}} key={i.id} id={`order-card-${i.id}`}>
            <CardHeader title={i.name || i.id} />
            <CardActions>
              <IconButton onClick={this.handleUp(i.id)}>
                <KeyboardArrowUp />
              </IconButton>
              <IconButton onClick={this.handleDown(i.id)}>
                <KeyboardArrowDown />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </div>
    );
  }
}

export default OverviewSidebar;
