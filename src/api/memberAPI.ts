import {MemberEntity, createDefaultMemberEntity } from '../model/member';

class MemberAPI {

  // Just return a copy of the mock data
  getAllMembers(organizationName : string) : Promise<MemberEntity[]> 
  {
    const gitHubMembersUrl : string = `https://api.github.com/orgs/${organizationName}/members`;

    return fetch(gitHubMembersUrl)
    .then((response) => this.checkStatus(response,organizationName))
    .then((response) => this.parseJSON(response))
    .then((data) => this.resolveMembers(data,organizationName))
    
    }

  private checkStatus(response : Response, organizationName:string) : Promise<Response> {
    if ((response.status >= 200 && response.status < 300) ||response.status==404) {
      return Promise.resolve(response);
    } else{
      let error = new Error(response.statusText);
      throw error;
    }
  }

  private parseJSON(response : Response) : any {
      return response.json();
  }

  private noResults() : any{
    
    var member : MemberEntity= createDefaultMemberEntity();

      member.id = 0;
      member.login = 'no results';
      member.avatar_url = 'no results';
      member.company='no results for ';

      return member;
  }

  private resolveMembers (data : any, organizationName : string) : Promise<MemberEntity[]> {
    var members;
    try {
      members= data.map((gitHubMember:MemberEntity) => {
        var member : MemberEntity = createDefaultMemberEntity();
  
        member.id = gitHubMember.id;
        member.login = gitHubMember.login;
        member.avatar_url = gitHubMember.avatar_url;
        member.company=organizationName;
  
        return member;
      }
      );
    } catch (error) {
      	members =
        [
          {
            id: 0,
            login: "no results",
            avatar_url: "https://vignette.wikia.nocookie.net/universosteven/images/7/7d/Sign-Alert-icon.png/revision/latest?cb=20150907212201&path-prefix=es",
            company:"for company "+organizationName
          },
        ];
    }
      
    
    

    return Promise.resolve(members);
  }
}

export const memberAPI = new MemberAPI();
