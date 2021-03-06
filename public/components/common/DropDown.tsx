import * as React from "react";
import { findDOMNode } from "react-dom";
import { classSet } from "@fider/services";

import "./DropDown.scss";

export interface DropDownItem {
  value: any;
  label: string;
  render?: JSX.Element;
}

export interface DropDownProps {
  className?: string;
  defaultValue?: any;
  items: DropDownItem[];
  placeholder?: string;
  searchable?: boolean;
  inline?: boolean;
  header?: string;
  direction?: "left" | "right";
  onChange?: (item: DropDownItem) => void;
  onSearchChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  renderText?: (item?: DropDownItem) => JSX.Element | undefined;
}

export interface DropDownState {
  isOpen: boolean;
  selected?: DropDownItem;
}

export class DropDown extends React.Component<DropDownProps, DropDownState> {
  private mounted = false;

  public static defaultProps: Partial<DropDownProps> = {
    direction: "right"
  };

  constructor(props: DropDownProps) {
    super(props);
    this.state = {
      selected: this.findItem(props.defaultValue, props.items),
      isOpen: false
    };
  }

  public componentDidMount() {
    this.mounted = true;
  }

  public componentWillUnmount() {
    this.mounted = false;
    this.removeListeners();
  }

  private addListeners() {
    document.addEventListener("click", this.handleDocumentClick, false);
    document.addEventListener("touchend", this.handleDocumentClick, false);
  }

  private removeListeners() {
    document.removeEventListener("click", this.handleDocumentClick, false);
    document.removeEventListener("touchend", this.handleDocumentClick, false);
  }

  public handleMouseDown = (event: any) => {
    if (event.type === "mousedown" && event.button !== 0) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    this.setState(
      {
        isOpen: true
      },
      this.addListeners
    );
  };

  public findItem(value: any, items: DropDownItem[]): DropDownItem | undefined {
    for (const item of items) {
      if (item.value === value) {
        return item;
      }
    }
    return undefined;
  }

  public setSelected(selected: DropDownItem) {
    const newState = {
      selected,
      isOpen: false
    };
    this.fireChangeEvent(newState);
    this.setState(newState, this.removeListeners);
  }

  public fireChangeEvent(newState: DropDownState) {
    if (newState.selected && newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  }

  public renderItem = (item: DropDownItem) => {
    const { label, value } = item;
    const isSelected = this.state.selected && value === this.state.selected.value;
    const className = classSet({
      "c-dropdown-item": true,
      "is-selected": isSelected
    });

    return (
      <div
        key={value}
        className={className}
        onMouseDown={this.setSelected.bind(this, item)}
        onClick={this.setSelected.bind(this, item)}
      >
        {item.render ? item.render : label}
      </div>
    );
  };

  public buildItemList() {
    const items = this.props.items.map(this.renderItem);

    return (
      <div className="c-dropdown-menu">
        {this.props.header && <div className="c-dropdown-menu-header">{this.props.header}</div>}
        <div className="c-dropdown-menu-items">
          {items.length ? items : <div className={`c-dropdown-noresults`}>No results found</div>}
        </div>
      </div>
    );
  }

  public handleDocumentClick = (event: any) => {
    if (this.mounted) {
      const node = findDOMNode(this);
      if (node && !node.contains(event.target)) {
        if (this.state.isOpen) {
          this.setState(
            {
              isOpen: false
            },
            this.removeListeners
          );
        }
      }
    }
  };

  public render() {
    const text = this.state.selected ? (
      this.state.selected.label
    ) : (
      <span className="c-dropdown-placeholder">{this.props.placeholder}</span>
    );

    const search = <input type="text" autoFocus={true} onChange={this.props.onSearchChange} />;

    const dropdownClass = classSet({
      "c-dropdown": true,
      [`${this.props.className}`]: this.props.className,
      "is-open": this.state.isOpen,
      "is-inline": this.props.inline,
      "m-right": this.props.direction === "right",
      "m-left": this.props.direction === "left"
    });

    return (
      <div className={dropdownClass}>
        <div onMouseDown={this.handleMouseDown} onTouchEnd={this.handleMouseDown}>
          {this.props.renderText ? (
            <div className="c-dropdown-text">{this.props.renderText(this.state.selected)}</div>
          ) : (
            <div className="c-dropdown-control">
              {this.state.isOpen && this.props.searchable ? search : <div>{text}</div>}
              <span className="c-dropdown-arrow" />
            </div>
          )}
        </div>
        {this.state.isOpen && this.buildItemList()}
      </div>
    );
  }
}
