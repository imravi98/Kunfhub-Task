import React, {Component} from 'react';
import Tile from './Tiles/TileUI';
import Search from './Search/Search';
class App extends Component {
    state = {
        loading: true,
        paidConfs: [],
        freeConfs: []
    };

    async componentDidMount(){
        const url = "https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences";
        const response = await fetch(url);
        const data = await response.json();
        this.setState({paidConfs: data.paid, freeConfs: data.free, loading:false});
    }

    render() {
        if (this.state.loading) {
            return <div>Fetching Info For You</div>;
        }

        if (!this.state.paidConfs.length && !this.state.freeConfs.length) {
            return <div>No conference data available</div>;
        }
        
        const paidConfsJSX = this.state.paidConfs.map(conference => (
            <div key={conference.conference_id} className="container-fluid d-flex justify-content-center">
                <div className="row">
                    <div className="col-md-4"><Tile imgsrc={conference.imageURL} title={conference.confName} venue={conference.venue} start={conference.confStartDate} end={conference.confEndDate} site={conference.confUrl} link={conference.confRegUrl} price={conference.entryType} />
                    </div>
                </div>
            </div>
        ));

        const freeConfsJSX = this.state.freeConfs.map(conference => (
            <div key={conference.conference_id} className="container-fluid d-flex justify-content-center">
                <div className="row">
                    <div className="col-md-4"><Tile imgsrc={conference.imageURL} title={conference.confName} venue={conference.venue} start={conference.confStartDate} end={conference.confEndDate} site={conference.confUrl} link={conference.confRegUrl} price={conference.entryType} />
                    </div>
                </div>
            </div>
        ));

        return (
            <div>
                <Search />
                <div className="container-fluid d-flex justify-content-center">
                    <div className="row">
                        <div className="col-md-4">
                            {paidConfsJSX}
                        </div>
                        <div className="col-md-4">
                        </div>
                        <div className="col-md-4">
                            {freeConfsJSX}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;