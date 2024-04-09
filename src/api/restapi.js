class RestApi {
    //用户数据示例
    // constructor() {
    //     this.getUsers();
    // }
    // getUsers() {
    //     fetch().then(res => res.json()).then(data => {
    //         this.users = data;
    //     });
    //     return this.users;
    // }
    users = [
        {
            id: '08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a',
            name: 'Mattie',
            password: '123',
            avatar: '/static/images/Avatar-1.png',
            email: 'Mattie@goeasy.io',
            phone: '138xxxxxxxx',
        },
        {
            id: '3bb179af-bcc5-4fe0-9dac-c05688484649',
            name: 'Wallace',
            password: '123',
            avatar: '/static/images/Avatar-2.png',
            email: 'Wallace@goeasy.io',
            phone: '138xxxxxxxx',
        },
        {
            id: 'fdee46b0-4b01-4590-bdba-6586d7617f95',
            name: 'Tracy',
            password: '123',
            avatar: '/static/images/Avatar-3.png',
            email: 'Tracy@goeasy.io',
            phone: '138xxxxxxxx',
        },
        {
            id: '33c3693b-dbb0-4bc9-99c6-fa77b9eb763f',
            name: 'Juanita',
            password: '123',
            avatar: '/static/images/Avatar-4.png',
            email: 'Juanita@goeasy.io',
            phone: '138xxxxxxxx',
        }, 
       
    ];
    //群数据示例
    groups = [
        {
            id: 'group-a42b-47b2-bb1e-15e0f5f9a19a',
            name: '小程序交流群',
            avatar: '/static/images/wx.png',
            userList: [
                '08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a',
                '3bb179af-bcc5-4fe0-9dac-c05688484649',
                'fdee46b0-4b01-4590-bdba-6586d7617f95',
                '33c3693b-dbb0-4bc9-99c6-fa77b9eb763f',
            ],
        },
        {
            id: 'group-4b01-4590-bdba-6586d7617f95',
            name: 'UniApp交流群',
            avatar: '/static/images/uniapp.png',
            userList: [
                '08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a',
                'fdee46b0-4b01-4590-bdba-6586d7617f95',
                '33c3693b-dbb0-4bc9-99c6-fa77b9eb763f',
                '3bb179af-bcc5-4fe0-9dac-c05688484649',
            ],
        },
        {
            id: 'group-dbb0-4bc9-99c6-fa77b9eb763f',
            name: 'GoEasy交流群',
            avatar: '/static/images/goeasy.jpeg',
            userList: ['08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a', '3bb179af-bcc5-4fe0-9dac-c05688484649'],
        },
        
    ];

    zones = [
        {
            zoneId: 'zone-a42b-47b2-bb1e-15e0f5f9a19a',
            userId: '08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a',
            username: 'Mattie',
            useravatar: '/static/images/Avatar-1.png',
            name: 'Zone1',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero amet est perspiciatis nobis impedit dolore nam laborum necessitatibus aliquam illum similique perferendis at ipsa exercitationem sunt enim, saepe modi nulla!',
            time: '2024-03-05 00:00:00',
            likes:[
                "Mattie","Wallace"
            ],
            comments: [
                {
                    userId: '08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a',
                    username: 'Mattie',
                    useravatar: '/static/images/Avatar-1.png',
                    text: '测试2',
                    time: '2020-01-01 00:00:00',
                    subcomments: [
                        {
                            userId: '08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a',
                            username: 'Mattie',
                            useravatar: '/static/images/Avatar-1.png',
                            text: '测试4',
                            time: '2020-01-01 00:00:00'
                        }
                    ]
                },
                {
                    userId: '3bb179af-bcc5-4fe0-9dac-c05688484649',
                    username: 'Wallace',
                    useravatar: '/static/images/Avatar-2.png',
                    text: '测试3',
                    time: '2024-03-05 00:00:00',
                    subcomments: [],
                }
            ]
        },
    ];

    findUsers() {
        return this.users;
    };

    findFriends(user) {
        return this.users.filter((v) => v.id !== user.id);
    }

    findGroups(user) {
        return this.groups.filter((v) => v.userList.find((id) => id === user.id));
    }

    findUser(username, password) {
        return this.users.find((user) => user.name === username && user.password === password);
    }

    findGroupById(groupId) {
        return this.groups.find((group) => group.id === groupId);
    }

    findUserById(userId) {
        return this.users.find((user) => user.id === userId);
    }

    findGroupMembers (groupId) {
        let members = [];
        let group = this.groups.find(v => v.id === groupId);
        this.users.map(user => {
            let userId = group.userList.find((id)=>{
                return id === user.id;
            });
            members.push(user);
        });
        return members;
    }

    findGroupMemberAvatars (groupId) {
        let avatars = [];
        let group = this.groups.find((v) => v.id === groupId);
        this.users.map((user) => {
            group.userList.forEach((userId) => {
                if (user.id === userId) {
                    avatars.push(user.avatar);
                }
            });
        });
        return avatars;
    }

    searchUsers(keyword) {
        return this.users.filter((user) => user.name.indexOf(keyword) !== -1);
    }

    searchGroups(keyword) {
        return this.groups.filter((group) => group.name.indexOf(keyword) !== -1);
    }

    findZones(){
        return this.zones;
    }

}

export default new RestApi();
