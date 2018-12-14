import * as React from 'react';
import { MemberEntity } from '../../model/member';
import { memberAPI } from '../../api/memberAPI';
import { MemberRow } from './memberRow';
import { MemberHead } from './memberHead';
import {} from 'core-js';

interface Props {

}


// We define members as a state (the compoment holding this will be a container
// component)
interface State {
  members: Array<MemberEntity>,
  newCompany: string,
  olderCompany:string,
}

// Nice tsx guide: https://github.com/Microsoft/TypeScript/wiki/JSX
export class MembersTableComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    // set initial state
    this.state = { 
      members: [], 
      newCompany:'lemoncode',
      olderCompany:'' 
    };
  }

  loadMembers = (company: string) => {
    memberAPI.getAllMembers(company).then((members) =>
      this.setState({ members: members })
    );
  }

  checkAndLoadMembers=()=>{
    if(this.state.newCompany!=this.state.olderCompany && this.state.newCompany!=''){
      this.setState({olderCompany:this.state.newCompany});
      this.loadMembers(this.state.newCompany);
    }
  }
  
  actualizaNewCompany=(valor)=>{
    this.setState({newCompany:valor});

  }

  public render() {

    return (
      <div className="row">
        <h2> Members Page</h2>
        <button onClick={this.checkAndLoadMembers}>Load</button>
        <input type="text" value={this.state.newCompany} onChange={(event)=>this.actualizaNewCompany(event.target.value) }/>
        <table className="table">
          <thead>
            <MemberHead />
          </thead>
          <tbody>
            {
              this.state.members.map((member: MemberEntity) =>
                <MemberRow key={member.id} member={member} />
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}
